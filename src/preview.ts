'use strict';
import * as vscode from 'vscode';

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