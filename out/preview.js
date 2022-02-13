'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotStudyEditorProvider = void 0;
const vscode = require("vscode");
const language_1 = require("./language");
const util_1 = require("./util");
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
        const symbols = await new Promise((resolve, _reject) => {
            (0, util_1.getCurrentEditorSymbols)(document.uri, symbols => {
                resolve(symbols);
            });
        });
        if (symbols.length === 0) {
            webviewPanel.webview.html = '<h1>No symbols found</h1>';
            return;
        }
        const remote = vscode.workspace.getConfiguration('').get("dotstudy.remoteRaw");
        const path = (0, util_1.getCurrentEditorPath)(document);
        let html = "";
        (0, language_1.recursiveSymbolProcessor)(symbols[0], {
            [vscode.SymbolKind.Class]: (symbol) => {
                html += `<h1>${symbol.name}</h1>`;
            },
            [vscode.SymbolKind.Method]: (symbol) => {
                html += `<h2>${symbol.name}</h2>`;
            },
            [vscode.SymbolKind.File]: (symbol) => {
                let absolute = vscode.Uri.file(path + symbol.name);
                let relative = vscode.workspace.asRelativePath(absolute);
                let id = (0, util_1.getRandomId)(16);
                html += `
                    <div class="img-container">
                        <input type="checkbox" id="zoom-check-${id}">
                        <label for="zoom-check-${id}">
                            <img src="${remote + relative}" alt=${symbol.name}>
                        </label>
                    </div>
                    `;
            },
            [vscode.SymbolKind.Field]: (symbol) => {
                html += `<div class="expression"><h3>${symbol.name}</h3>`;
                for (const answer of symbol.detail.split("|| ||")) {
                    html += `<p>${answer}</p></div>`;
                }
                ;
            }
        });
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
                color: var(--vscode-checkbox-foreground);
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
        
                background-color: var(--vscode-input-background);
                color: transparent;
                transition: all 0.25s ease;
              }
        
              p:hover {
                background-color: var(--vscode-focusBorder);
                color: var(--vscode-foreground);
              }
        
              img {
                max-width: 30vw;
                max-height: 50vh;
                border-radius: 4px;
              }
              
              input[type=checkbox] {
                display: none;
              }

              .img-container img {
                max-width: 30vw;
                max-height: 50vh;
                  transition: all 0.25s ease;
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
exports.DotStudyEditorProvider = DotStudyEditorProvider;
DotStudyEditorProvider.viewType = 'dotstudy.preview';
//# sourceMappingURL=preview.js.map