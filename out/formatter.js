'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolFormatter = void 0;
const vscode = require("vscode");
function symbolFormatter(symbol, classFormatter, methodFormatter, fieldFormatter) {
    switch (symbol.kind) {
        case vscode.SymbolKind.Class: {
            return classFormatter(symbol);
            break;
        }
        case vscode.SymbolKind.Method: {
            return methodFormatter(symbol);
            break;
        }
        case vscode.SymbolKind.Field: {
            return fieldFormatter(symbol);
            break;
        }
    }
}
exports.symbolFormatter = symbolFormatter;
//# sourceMappingURL=formatter.js.map