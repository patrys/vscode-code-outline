import * as vscode from "vscode";

import { SymbolOutlineProvider } from "./symbolOutline";

export function activate(context: vscode.ExtensionContext) {
  const symbolOutlineProvider = new SymbolOutlineProvider(context);
}
