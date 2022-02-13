import * as vscode from 'vscode';

export function getCurrentEditorPath(document: (null | vscode.TextDocument) = null): string {
    if (document === null) {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) { return ""; };
        document = editor.document;
    }

    let path = document.fileName;
    path = (path === undefined) ? ".\\" : path;
    path = path.substring(0, path.lastIndexOf("\\") + 1);

    return path;
}

export function getCurrentEditorSymbols(uri: (null | vscode.Uri) = null, callback: (symbols: vscode.DocumentSymbol[]) => void) {
    if (uri === null) {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            callback([]);
            return;
        };
        uri = editor.document.uri;
    }

    vscode.commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        uri
    ).then(symbols => {
        callback(symbols as vscode.DocumentSymbol[]);
    });
}

export function getRandomId(length: number): string {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
