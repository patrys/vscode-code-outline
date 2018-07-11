# Code Outline tree provider for Visual Studio Code

> :warning: DEPRECATED. Please use the [Outline view](https://code.visualstudio.com/updates/v1_24#_outline-view) that comes with Visual Studio Code.

## Features

Displays a code outline tree in the explorer pane.

To activate find and expand the "Code Outline" section near the bottom of the Explorer tab.

## Language Support

For the outline to work, the language support plugins need to support symbol information.

For the outline to form a tree structure, the language support plugins need to report the entire definition range as part of symbol.

See VS Code [issue #34968](https://github.com/Microsoft/vscode/issues/34968) and language server protocol [issue #132](https://github.com/Microsoft/language-server-protocol/issues/132) for a discussion.

Here is a list of languages known to work with Code Outline:

| Language/Format | Extension |
| --- | --- |
| C | [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) |
| C++ | [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools), [cquery](https://github.com/cquery-project/vscode-cquery) |
| Docker | [Docker](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) |
| HTML | Comes with VS Code |
| Go | [Go](https://marketplace.visualstudio.com/items?itemName=ms-vscode.Go) |
| Java | [Language Support for Java(TM) by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)
| JavaScript | Comes with VS Code |
| JSON | Comes with VS Code |
| Markdown | Comes with VS Code |
| Perl | [Perl](https://marketplace.visualstudio.com/items?itemName=henriiik.vscode-perl) |
| PHP | [PHP Symbols](https://marketplace.visualstudio.com/items?itemName=linyang95.php-symbols) |
| Powershell | [PowerShell](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell) |
| Python | [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) |
| Rust | [Rust (rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) |
| TypeScript | Comes with VS Code |
| YAML | [YAML Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) |

Please report any missing extensions and I'll update the list.

## Extension Settings

Default settings:

```json
{
  "symbolOutline.doSort": false,
  "symbolOutline.sortOrder": [
    "Class",
    "Module",
    "Constant",
    "Interface",
    "*",
    "Constructor",
    "Function",
    "Method"
  ],
  "symbolOutline.expandNodes": [
    "Module",
    "Class",
    "Interface",
    "Namespace",
    "Object",
    "Package",
    "Struct"
  ],
  "symbolOutline.topLevel": [
    "*"
  ]
}
```

- **doSort:** sort the outline.
- **expandNodes:** kinds of nodes to be expanded automatically.
- **sortOrder:** order to the sort symbols.
- **topLevel:** wich symbols include at the topmost scope.

## Known Issues

Depending on other extensions you have installed the symbol list may initially return an empty list. Use the "Refresh" button next to the title to fix this.
