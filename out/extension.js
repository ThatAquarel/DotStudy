'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const preview_1 = require("./preview");
const language_1 = require("./language");
function activate(context) {
    context.subscriptions.push(preview_1.DotStudyEditorProvider.register(context));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "dotstudy-language" }, new language_1.DotStudySymbolProvider()));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map