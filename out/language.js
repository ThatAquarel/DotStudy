'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotStudySymbolProvider = void 0;
const vscode = require("vscode");
// function defaultSymbolFactory(line: vscode.TextLine, symbolKind: vscode.SymbolKind): vscode.DocumentSymbol {
//     return new vscode.DocumentSymbol(
//         line.text.substring(1), "",
//         symbolKind,
//         line.range, line.range
//     );
// };
// const symbolTypes: { [id: string]: (line: vscode.TextLine) => vscode.DocumentSymbol; } = {
//     "#": (line: vscode.TextLine) => { return defaultSymbolFactory(line, vscode.SymbolKind.Class); },
//     "!": (line: vscode.TextLine) => { return defaultSymbolFactory(line, vscode.SymbolKind.Method); },
// };
class DotStudySymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve, reject) => {
            let parent = undefined;
            let symbol = undefined;
            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                let text = line.text;
                if (text.startsWith("#")) {
                    parent = new vscode.DocumentSymbol(text.substring(1), "", vscode.SymbolKind.Class, line.range, line.range);
                }
                else if (text.startsWith("!")) {
                    if (symbol) {
                        parent?.children.push(symbol);
                    }
                    symbol = new vscode.DocumentSymbol(text.substring(1), "test", vscode.SymbolKind.Method, line.range, line.range);
                }
                else {
                    if (text === "") {
                        continue;
                    }
                    ;
                    symbol?.children.push(new vscode.DocumentSymbol(text, "test1 ", vscode.SymbolKind.Field, line.range, line.range));
                }
            }
            if (symbol) {
                parent?.children.push(symbol);
            }
            ;
            resolve((parent === undefined) ? [] : [parent]);
        });
    }
}
exports.DotStudySymbolProvider = DotStudySymbolProvider;
//# sourceMappingURL=language.js.map