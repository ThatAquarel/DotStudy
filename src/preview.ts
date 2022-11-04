'use strict';
import * as vscode from 'vscode';
//import * as path from 'path';
import { recursiveSymbolProcessor } from './language';
import { getCurrentEditorPath, getCurrentEditorSymbols, getRandomId } from './util';

export class DotStudyEditorProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new DotStudyEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
          DotStudyEditorProvider.viewType, 
          provider
        );
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
      const currentPath = getCurrentEditorPath(document);
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(currentPath)]
        };
        
        const symbols = await new Promise((resolve, _reject) => {
            getCurrentEditorSymbols(document.uri, symbols => {
                resolve(symbols);
            });
        }) as vscode.DocumentSymbol[];
        if (symbols.length === 0) {
            webviewPanel.webview.html = '<h1>No symbols found</h1>';
            return;
        }

        let html = "";
        recursiveSymbolProcessor(
            symbols[0],
            {
                [vscode.SymbolKind.Class]: (symbol: vscode.DocumentSymbol) => {
                    html += `<h1>${symbol.name}</h1>`;
                },
                [vscode.SymbolKind.Method]: (symbol: vscode.DocumentSymbol) => {
                    html += `<h2>${symbol.name}</h2>`;
                },
                [vscode.SymbolKind.File]: (symbol: vscode.DocumentSymbol) => {
                    const diskPath = vscode.Uri.file(
                      //path.join(currentPath, symbol.name) 
                      currentPath + symbol.name
                    );
                    const webviewPath = webviewPanel.webview.asWebviewUri(diskPath);

                    let id = getRandomId(16);
                    html += `
                    <div class="img-container">
                        <input type="checkbox" id="zoom-check-${id}">
                        <label for="zoom-check-${id}">
                            <img src="${webviewPath}" alt=${symbol.name}>
                        </label>
                    </div>
                    `;
                },
                [vscode.SymbolKind.Field]: (symbol: vscode.DocumentSymbol) => {
                    html += `<div class="expression"><h3>${symbol.name}</h3>`;
                    for (const answer of symbol.detail.split("|| ||")) {
                        html += `<p>${answer}</p></div>`;
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

            <title>DotStudy Preview</title>
            <style>
              #container {
                margin: 8px;
                color: var(--vscode-menu-background);
                margin-bottom: 32px;
              }
        
              h1,
              h2 {
                font-weight: 700;
                text-decoration: underline;
                color: var(--vscode-foreground);
              }
        
              h1 {
                  font-size: 2em;
              }

              h2 {
                  margin-top: 32px;
                  font-size: 1.5em;
              }
        
              h3,
              p {
                display: inline-block;
                font-weight: 400;
                font-size: 1.25em;
        
                margin: 0;
              }
        
              .expression {
                display: block;
                margin-bottom: 5px;
              }
        
              h3 {
                color: var(--vscode-foreground);
              }
        
              p {
                margin-left: 16px;
                border-radius: 4px;
        
                background-color: var(--vscode-editorWidget-background);
                color: transparent;
                transition: all 0.25s ease;
              }
        
              p:hover {
                background-color: var(--vscode-focusBorder--vscode-button-secondaryBackground);
                color: var(--vscode-foreground);
              }
        
              input[type=checkbox] {
                display: none;
              }
              
              .img-container img {
                max-width: 40vw;
                max-height: 50vh;
                transition: all 0.25s ease;

                border-radius: 4px;
                cursor: zoom-in;
              }

              input[type=checkbox]:checked ~ label > img {
                max-width: 60vw;
                max-height: 100vh;
                cursor: zoom-out;
              }
            </style>
        </head>
        <body>
            <div id="container">
                ${html}
            </div>
            <footer>aquarel 2022</footer>
        </body>
        </html>`;
    }
}
