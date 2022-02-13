'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotStudySymbolProvider = exports.recursiveSymbolProcessor = void 0;
const vscode = require("vscode");
function recursiveSymbolProcessor(parent, functions) {
    function recursiveTree(symbol) {
        if (symbol.kind in functions) {
            functions[symbol.kind](symbol);
        }
        for (const child of symbol.children) {
            recursiveTree(child);
        }
    }
    ;
    recursiveTree(parent);
}
exports.recursiveSymbolProcessor = recursiveSymbolProcessor;
;
function defaultSymbolFactory(line, symbolKind) {
    return new vscode.DocumentSymbol(line.text.substring(1), "", symbolKind, line.range, line.range);
}
;
function questionSymbolFactory(line) {
    let indices = [".", "?"].map((separator) => {
        let i = line.text.indexOf(separator);
        return (i >= 0) ? i : Infinity;
    });
    let end = Math.min(...indices) + 1;
    return new vscode.DocumentSymbol(line.text.substring(0, end), line.text.substring(end, line.text.length), vscode.SymbolKind.Field, line.range, line.range);
}
const symbolTypes = {
    "#": (line) => { return defaultSymbolFactory(line, vscode.SymbolKind.Class); },
    "!": (line) => { return defaultSymbolFactory(line, vscode.SymbolKind.Method); },
    "&": (line) => { return defaultSymbolFactory(line, vscode.SymbolKind.File); },
    "?": questionSymbolFactory
};
class DotStudySymbolProvider {
    provideDocumentSymbols(document, _token) {
        return new Promise((resolve, _reject) => {
            let parent = undefined;
            let symbol = undefined;
            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                let text = line.text;
                if (text.startsWith("#")) {
                    parent = symbolTypes["#"](line);
                }
                else if (text.startsWith("!")) {
                    if (symbol) {
                        parent?.children.push(symbol);
                    }
                    ;
                    symbol = symbolTypes["!"](line);
                }
                else if (text.startsWith("&")) {
                    symbol?.children.push(symbolTypes["&"](line));
                }
                else if (text !== "") {
                    symbol?.children.push(symbolTypes["?"](line));
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