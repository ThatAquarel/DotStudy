'use strict';
import * as vscode from 'vscode';

function defaultSymbolFactory(line: vscode.TextLine, symbolKind: vscode.SymbolKind): vscode.DocumentSymbol {
    return new vscode.DocumentSymbol(
        line.text.substring(1), "",
        symbolKind,
        line.range, line.range
    );
};

function questionSymbolFactory(line: vscode.TextLine): vscode.DocumentSymbol {
    let indices = [".", "?"].map((separator) => {
        let i = line.text.indexOf(separator);

        return (i >= 0) ? i : Infinity;
    });

    let end = Math.min(...indices) + 1;

    return new vscode.DocumentSymbol(
        line.text.substring(0, end),
        line.text.substring(end, line.text.length),
        vscode.SymbolKind.Field,
        line.range, line.range
    );
}

const symbolTypes: { [id: string]: (line: vscode.TextLine) => vscode.DocumentSymbol; } = {
    "#": (line: vscode.TextLine) => { return defaultSymbolFactory(line, vscode.SymbolKind.Class); },
    "!": (line: vscode.TextLine) => { return defaultSymbolFactory(line, vscode.SymbolKind.Method); },
    "?": questionSymbolFactory
};

export class DotStudySymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: vscode.TextDocument,
        token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
        return new Promise((resolve, reject) => {

            let parent: vscode.DocumentSymbol | undefined = undefined;
            let symbol: vscode.DocumentSymbol | undefined = undefined;

            for (let i = 0; i < document.lineCount; i++) {
                let line = document.lineAt(i);
                let text = line.text;

                if (text.startsWith("#")) {
                    parent = symbolTypes["#"](line);
                } else if (text.startsWith("!")) {
                    if (symbol) { parent?.children.push(symbol); };
                    symbol = symbolTypes["!"](line);
                } else if (text !== "") {
                    symbol?.children.push(symbolTypes["?"](line));
                }
            }

            if (symbol) { parent?.children.push(symbol); };

            resolve((parent === undefined) ? [] : [parent]);
        });
    }
}
