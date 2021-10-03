"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.workspace.registerNotebookSerializer('dotstudy-notebook', new SampleSerializer()));
}
exports.activate = activate;
class SampleSerializer {
    async deserializeNotebook(content, _token) {
        var contents = new TextDecoder().decode(content);
        let raw;
        try {
            raw = JSON.parse(contents);
        }
        catch {
            raw = [];
        }
        const cells = raw.map(item => new vscode.NotebookCellData(item.kind, item.value, item.language));
        return new vscode.NotebookData(cells);
    }
    async serializeNotebook(data, _token) {
        let contents = [];
        for (const cell of data.cells) {
            contents.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value
            });
        }
        return new TextEncoder().encode("test encode");
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map