"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = exports.getCurrentEditorSymbols = exports.getCurrentEditorPath = void 0;
const vscode = require("vscode");
function getCurrentEditorPath(document = null) {
    if (document === null) {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            return "";
        }
        ;
        document = editor.document;
    }
    let path = document.fileName;
    path = (path === undefined) ? ".\\" : path;
    path = path.substring(0, path.lastIndexOf("\\") + 1);
    return path;
}
exports.getCurrentEditorPath = getCurrentEditorPath;
function getCurrentEditorSymbols(uri = null, callback) {
    if (uri === null) {
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            callback([]);
            return;
        }
        ;
        uri = editor.document.uri;
    }
    vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri).then(symbols => {
        callback(symbols);
    });
}
exports.getCurrentEditorSymbols = getCurrentEditorSymbols;
function getRandomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
exports.getRandomId = getRandomId;
//# sourceMappingURL=util.js.map