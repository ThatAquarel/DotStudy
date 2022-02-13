'use strict';
import * as vscode from 'vscode';
import { recursiveSymbolProcessor } from './language';

export class DotStudyEditorProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new DotStudyEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(DotStudyEditorProvider.viewType, provider);
        return providerRegistration;
    }

    private static readonly viewType = 'dotstudy.preview';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };

        let values: unknown = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
        let symbols = values as vscode.DocumentSymbol[];

        let html = "";

        recursiveSymbolProcessor(
            symbols[0],
            {
                [vscode.SymbolKind.Class]: (symbol: vscode.DocumentSymbol) => {
                    html += `<h1>${symbol.name}<h1>`;
                },
                [vscode.SymbolKind.Method]: (symbol: vscode.DocumentSymbol) => {
                    html += `<h2>${symbol.name}<h2>`;
                },
                [vscode.SymbolKind.Field]: (symbol: vscode.DocumentSymbol) => {
                    html += `<h3>${symbol.name}<h3>`;
                    for (const answer of symbol.detail.split("|| ||")) {
                        html += `<p>${answer}</p>`;
                    };
                }
            }
        );

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