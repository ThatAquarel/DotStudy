'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const language_1 = require("./language");
const preview_1 = require("./preview");
const publish_1 = require("./publish");
function activate(context) {
    context.subscriptions.push(preview_1.DotStudyEditorProvider.register(context));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "dotstudy-language" }, new language_1.DotStudySymbolProvider()));
    context.subscriptions.push(vscode_1.commands.registerCommand('dotstudy.publish', publish_1.publish));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map