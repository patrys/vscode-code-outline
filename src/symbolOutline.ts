import { Range, Event, EventEmitter, ExtensionContext, SymbolKind, SymbolInformation, TextDocument, TextEditor, TreeDataProvider, TreeItem, TreeItemCollapsibleState, commands, window, workspace } from 'vscode';
import * as path from 'path';

let optsSortOrder: number[] = [];
let optsTopLevel: number[] = [];
let optsExpandNodes: number[] = [];
let optsDoSort = true;
let optsDoSelect = true;

export class SymbolNode {
    symbol: SymbolInformation;
    children?: SymbolNode[];

    constructor(symbol?: SymbolInformation) {
        this.children = [];
        this.symbol = symbol;
    }

    /**
     * Judge if a node should be expanded automatically.
     * @param kind
     */
    public static shouldAutoExpand(kind: SymbolKind): boolean {
        let ix = optsExpandNodes.indexOf(kind);
        if (ix < 0) {
            ix = optsExpandNodes.indexOf(-1);
        }
        return ix > -1;
    }

    private getKindOrder(kind: SymbolKind): number {
        let ix = optsSortOrder.indexOf(kind);
        if (ix < 0) {
            ix = optsSortOrder.indexOf(-1);
        }
        return ix;
    }

    private compareSymbols(a: SymbolNode, b: SymbolNode): number {
        const kindOrder = this.getKindOrder(a.symbol.kind) - this.getKindOrder(b.symbol.kind);
        if (kindOrder !== 0) {
            return kindOrder;
        }
        if (a.symbol.name.toLowerCase() > b.symbol.name.toLowerCase()) {
            return 1;
        }
        return -1;
    }

    sort() {
        this.children.sort(this.compareSymbols.bind(this));
        this.children.forEach(child => child.sort());
    }

    addChild(child: SymbolNode) {
        this.children.push(child);
    }
}

export class SymbolOutlineProvider implements TreeDataProvider<SymbolNode> {
    private _onDidChangeTreeData: EventEmitter<SymbolNode | null> = new EventEmitter<SymbolNode | null>();
    readonly onDidChangeTreeData: Event<SymbolNode | null> = this._onDidChangeTreeData.event;

    private context: ExtensionContext;
    private tree: SymbolNode;
    private editor: TextEditor;

    private getSymbols(document: TextDocument): Thenable<SymbolInformation[]> {
        return commands.executeCommand<SymbolInformation[]>('vscode.executeDocumentSymbolProvider', document.uri);
    }

    private async updateSymbols(editor: TextEditor): Promise<void> {
        const tree = new SymbolNode();
        this.editor = editor;
        if (editor) {
            readOpts();
            let symbols = await this.getSymbols(editor.document);
            if (optsTopLevel.indexOf(-1) < 0) {
               symbols = symbols.filter(sym => optsTopLevel.indexOf(sym.kind) >= 0);
            }
            const symbolNodes = symbols.map(symbol => new SymbolNode(symbol));
            symbolNodes.forEach(currentNode => {
                const potentialParents = symbolNodes.filter(node => node !== currentNode && node.symbol.location.range.contains(currentNode.symbol.location.range));
                if (!potentialParents.length) {
                    tree.addChild(currentNode);
                    return;
                }
                potentialParents.sort((a: SymbolNode, b: SymbolNode) => {
                    const startComparison = b.symbol.location.range.start.compareTo(a.symbol.location.range.start);
                    if (startComparison != 0) {
                        return startComparison;
                    }
                    return a.symbol.location.range.end.compareTo(b.symbol.location.range.end);
                });
                const parent = potentialParents[0];
                parent.addChild(currentNode);
            });
            if (optsDoSort) {
                tree.sort();
            }
        }
        this.tree = tree;
    }

    constructor(context: ExtensionContext) {
        this.context = context;
        window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.refresh();
            }
        });
        workspace.onDidCloseTextDocument(document => {
            if (!this.editor.document) {
                this.refresh();
            }
        });
        workspace.onDidChangeTextDocument(event => {
            if (!event.document.isDirty && event.document === this.editor.document) {
                this.refresh();
            }
        });
        workspace.onDidSaveTextDocument(document => {
            if (document === this.editor.document) {
                this.refresh();
            }
        });
    }

    async getChildren(node?: SymbolNode): Promise<SymbolNode[]> {
        if (node) {
            return node.children;
        } else {
            await this.updateSymbols(window.activeTextEditor);
            return this.tree ? this.tree.children : [];
        }
    }

    private getIcon(kind: SymbolKind): {dark: string; light: string} {
        let icon: string;
        switch (kind) {
            case SymbolKind.Class:
                icon = 'class';
                break;
            case SymbolKind.Constant:
                icon = 'constant';
                break;
            case SymbolKind.Constructor:
            case SymbolKind.Function:
            case SymbolKind.Method:
                icon = 'function';
                break;
            case SymbolKind.Interface:
                icon = 'interface';
            case SymbolKind.Module:
            case SymbolKind.Namespace:
            case SymbolKind.Object:
            case SymbolKind.Package:
                icon = 'module';
                break;
            case SymbolKind.Property:
                icon = 'property';
                break;
            default:
                icon = 'variable';
                break;
        };
        icon = `icon-${icon}.svg`;
        return {
            dark: this.context.asAbsolutePath(path.join('resources', 'dark', icon)),
            light: this.context.asAbsolutePath(path.join('resources', 'light', icon))
        };
    }

    getTreeItem(node: SymbolNode): TreeItem {
        const { kind } = node.symbol;
        let treeItem = new TreeItem(node.symbol.name);

        if (node.children.length) {

            treeItem.collapsibleState = optsExpandNodes.length && SymbolNode.shouldAutoExpand(kind) ?
                TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed;
        }
        else {

            treeItem.collapsibleState = TreeItemCollapsibleState.None;
        }

        const range = optsDoSelect ? node.symbol.location.range : new Range(
            node.symbol.location.range.start,
            node.symbol.location.range.start
        )

        treeItem.command = {
            command: 'symbolOutline.revealRange',
            title: '',
            arguments: [
                this.editor,
                range
            ]
        };

        treeItem.iconPath = this.getIcon(kind);
        return treeItem;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }
}

function readOpts() {
   let opts = workspace.getConfiguration("symbolOutline");
   optsDoSort = opts.get<boolean>("doSort");
   optsDoSelect = opts.get<boolean>("doSelect");
   optsExpandNodes = convertEnumNames(opts.get<string[]>("expandNodes"));
   optsSortOrder = convertEnumNames(opts.get<string[]>("sortOrder"));
   optsTopLevel = convertEnumNames(opts.get<string[]>("topLevel"));
}

function convertEnumNames(names:string[]):number[] {
   return names.map(str => {
      let v = SymbolKind[str];
      return typeof v == "undefined" ? -1 : v;
   });
}
