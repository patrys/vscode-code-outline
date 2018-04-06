import * as path from "path";
import { ExtensionContext, SymbolKind } from "vscode";

export const getIcon = (
  kind: SymbolKind,
  context: ExtensionContext
): { dark: string; light: string } => {
  let icon: string;
  switch (kind) {
    case SymbolKind.Class:
      icon = "class";
      break;
    case SymbolKind.Constant:
      icon = "constant";
      break;
    case SymbolKind.Constructor:
    case SymbolKind.Function:
    case SymbolKind.Method:
      icon = "function";
      break;
    case SymbolKind.Interface:
      icon = "interface";
    case SymbolKind.Module:
    case SymbolKind.Namespace:
    case SymbolKind.Object:
    case SymbolKind.Package:
      icon = "module";
      break;
    case SymbolKind.Property:
      icon = "property";
      break;
    default:
      icon = "variable";
      break;
  }
  icon = `icon-${icon}.svg`;
  return {
    dark: context.asAbsolutePath(path.join("resources", "dark", icon)),
    light: context.asAbsolutePath(path.join("resources", "light", icon))
  };
};
