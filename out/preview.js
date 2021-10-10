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
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        console.log("");
        // document.getText
        // webviewPanel.webview.html = "<p>test 1</p>";
        // webviewPanel.webview.html = `
        // <!DOCTYPE html>
        // <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <!--
        //     Use a content security policy to only allow loading images from https or from our extension directory,
        //     and only allow scripts that have a specific nonce.
        //     -->
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>DotStudy Preview ---</title>
        // </head>
        // <body>
        //     <p>test</p>
        // </body>
        // </html>`;
    }
}
exports.DotStudyEditorProvider = DotStudyEditorProvider;
DotStudyEditorProvider.viewType = 'dotstudy.preview';
//# sourceMappingURL=preview.js.map