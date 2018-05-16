# Change Log

## 0.2.1

- Fix case where two symbols have the same reported range ([issue #127](https://github.com/patrys/vscode-code-outline/issues/127))

## 0.2.0

- Provide a standalone activity bar viewlet ([issue #32](https://github.com/patrys/vscode-code-outline/issues/32), [issue #70](https://github.com/patrys/vscode-code-outline/issues/70), [issue #117](https://github.com/patrys/vscode-code-outline/issues/117))

## 0.1.1

- No longer automatically reveal the symbol under cursor as it caused problems ([issue #102](https://github.com/patrys/vscode-code-outline/issues/102), [issue #104](https://github.com/patrys/vscode-code-outline/issues/104), [issue #110](https://github.com/patrys/vscode-code-outline/issues/110), [issue #111](https://github.com/patrys/vscode-code-outline/issues/111))
- Provide a context menu command that does the same thing

## 0.1.0

- No longer select blocks of code when activating a symbol ([issue #69](https://github.com/patrys/vscode-code-outline/issues/69))
- Automatically reveal the symbol under cursor in the tree view ([issue #12](https://github.com/patrys/vscode-code-outline/issues/12), [issue #71](https://github.com/patrys/vscode-code-outline/issues/71))
- Require VS Code version 1.22.0 or later

## 0.0.13

- Documentation improvements in README

## 0.0.12

- Implement a much faster tree building algorithm ([issue #55](https://github.com/patrys/vscode-code-outline/issues/55))

## 0.0.11

- Use location ranges to determine symbol containment

## 0.0.10

- Expand namespaces, packages, classes and structures by default (can be configured in settings)
- Default to no sorting (can still be enabled in settings)

## 0.0.9

- Improved scrolling and correct handling for split editing

## 0.0.8

- Sorting is now configurable and you can filter top-level symbols ([#28 by @sceutre](https://github.com/patrys/vscode-code-outline/pull/28))
- Ad-hoc containers like unnamed scopes are no longer ignored ([#27 by @jacobdufault](https://github.com/patrys/vscode-code-outline/pull/27))

## 0.0.7

- Clear the tree when editor is closed
- Fix `Cannot read property 'children' of undefined` error

## 0.0.6

- Fix some icons being raster bitmaps

## 0.0.5

- Refresh the outline when the document is saved or reloaded from disk

## 0.0.4

- Better icon consistency with VSCode
- Support for light themes

## 0.0.3

- Added a refresh button

## 0.0.2

- Clicking items activates the editor

## 0.0.1

- Initial release
