import * as vscode from 'vscode';
import { SymbolKind } from 'vscode';
import * as path from 'path';

const getKindOrder = (kind: SymbolKind): number => {
    const kindOrder = {
        [SymbolKind.Class]: 2,
        [SymbolKind.Constant]: -1,
        [SymbolKind.Constructor]: 3,
        [SymbolKind.Function]: 3,
        [SymbolKind.Interface]: 1,
        [SymbolKind.Method]: 3,
        [SymbolKind.Module]: -2
    };
    if (kind in kindOrder) {
        return kindOrder[kind];
    }
    return 0;
}

const compareSymbols = (a: SymbolNode, b: SymbolNode): number => {
    const kindOrder = getKindOrder(a.symbol.kind) - getKindOrder(b.symbol.kind);
    if (kindOrder !== 0) {
        return kindOrder;
    }
    if (a.symbol.name.toLowerCase() > b.symbol.name.toLowerCase()) {
        return 1;
    }
    return -1;
}

export class SymbolNode {
    symbol: vscode.SymbolInformation;
    children?: SymbolNode[];

    constructor(symbol?: vscode.SymbolInformation) {
        this.children = [];
        this.symbol = symbol;
    }

    addChild(child: SymbolNode) {
        this.children.push(child);
        this.children.sort(compareSymbols);
    }
}

export class SymbolOutlineProvider implements vscode.TreeDataProvider<SymbolNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<SymbolNode | null> = new vscode.EventEmitter<SymbolNode | null>();
    readonly onDidChangeTreeData: vscode.Event<SymbolNode | null> = this._onDidChangeTreeData.event;

    private context: vscode.ExtensionContext;
    private tree: SymbolNode;

    private async updateSymbols(editor): Promise<void> {
        const tree = new SymbolNode();
        if (editor) {
            console.log(editor.document.uri);
            const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', editor.document.uri);
            symbols.reduce((map, symbol) => {
                let parent: SymbolNode;
                const node = new SymbolNode(symbol);
                if (symbol.containerName === '') {
                    parent = tree;
                    map = {[symbol.name]: node};
                } else if (symbol.containerName in map) {
                    parent = map[symbol.containerName];
                    map = {...map, [symbol.name]: node};
                } else {
                    return map;
                }
                if (symbol.kind === SymbolKind.Variable) {
                    if (parent.symbol && parent.symbol.kind !== SymbolKind.Class && parent.symbol.kind !== SymbolKind.Interface && parent.symbol.kind !== SymbolKind.Struct) {
                        return map;
                    }
                }
                parent.addChild(node);
                return map;
            }, {});
        }
        this.tree = tree;
        this._onDidChangeTreeData.fire();
    }


    constructor(context: vscode.ExtensionContext) {
        this.context = context;
		vscode.window.onDidChangeActiveTextEditor(editor => {
            this.updateSymbols(editor);
		});
		this.updateSymbols(vscode.window.activeTextEditor);
	}

    getChildren(node?: SymbolNode): Thenable<SymbolNode[]> {
		if (node) {
			return Promise.resolve(node.children);
		} else {
			return Promise.resolve(this.tree ? this.tree.children : []);
		}
	}

    private getIcon(kind: SymbolKind): string {
        let icon;
        if (kind === SymbolKind.Class) {
            icon = 'icon-class.svg';
        } else if (kind === SymbolKind.Constructor || kind === SymbolKind.Function || kind === SymbolKind.Method) {
            icon = 'icon-function.svg';
        } else if (kind === SymbolKind.Module) {
            icon = 'icon-module.svg';
        } else if (kind === SymbolKind.Property) {
            icon = 'icon-property.svg';
        } else {
            icon = 'icon-variable.svg';
        }
        if (icon) {
            return this.context.asAbsolutePath(path.join('resources', icon));
        }
    }

    getTreeItem(node: SymbolNode): vscode.TreeItem {
        const { kind } = node.symbol;
		let treeItem: vscode.TreeItem = new vscode.TreeItem(node.symbol.name, node.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        treeItem.command = {
			command: 'revealLine',
			title: '',
			arguments: [{lineNumber: node.symbol.location.range.start.line, at: 'center'}]
		};
        treeItem.iconPath = this.getIcon(kind);
		return treeItem;
	}
}