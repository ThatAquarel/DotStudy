'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotStudyEditorProvider = void 0;
const vscode = require("vscode");
class DotStudyEditorProvider {
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new DotStudyEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(DotStudyEditorProvider.viewType, provider);
        return providerRegistration;
    }
    async resolveCustomTextEditor(document, webviewPanel, _token) {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        let values = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
        let symbols = values;
        let html = "";
        function stringifySymbols(symbol) {
            switch (symbol.kind) {
                case vscode.SymbolKind.Class: {
                    html += `<h1>${symbol.name}<h1>`;
                    break;
                }
                case vscode.SymbolKind.Method: {
                    html += `<h2>${symbol.name}<h2>`;
                    break;
                }
                case vscode.SymbolKind.Field: {
                    html += `<h3>${symbol.name}<h3>`;
                    for (const answer of symbol.detail.split("|| ||")) {
                        html += `<p>${answer}</p>`;
                    }
                    break;
                }
            }
            for (const child of symbol.children) {
                stringifySymbols(child);
            }
        }
        stringifySymbols(symbols[0]);
        webviewPanel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">

            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <title>DotStudy Preview ---</title>
            <style>
                #container {
                    margin: 8px;
                }

                h1 {
                    padding-bottom: .1em;
                    font-size: 2em;
                    font-weight: 600;
                }

                h2 {
                    padding-top: .3em
                    padding-bottom: .1em;
                    font-size: 1.5em;
                    margin-top: 12px;
                }

                h3 {
                    margin-left: 16px;
                    margin-bottom: 0px;
                    margin-top: 0px;
                    font-weight: 400;
                    line-height: 1.25;
                    color: #aab1be;
                }

                h1,
                h2 {
                    margin-bottom: 16px;
                    font-weight: 600;
                    line-height: 1.25;
                    color: #f0f0f0;
                }

                p {
                    font-weight: 400;
                    margin-top: 0;
                    margin-bottom: 16px;
                    margin-left: 24px;
                    border-radius: 4px;
                    background-color: #1e2227;
                    color: transparent;
                    transition: all 0.25s;
                }

                p:hover{
                    background-color: #3a3f4b;
                    color: #aab1be;
                }
            </style>
        </head>
        <body>
            <div id="container">
                ${html}
            </div>
        </body>
        </html>`;
    }
}
exports.DotStudyEditorProvider = DotStudyEditorProvider;
DotStudyEditorProvider.viewType = 'dotstudy.preview';
//# sourceMappingURL=preview.js.map