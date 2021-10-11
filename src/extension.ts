'use strict';
import * as vscode from 'vscode';
import { commands } from 'vscode';
import { DotStudySymbolProvider } from './language';
import { DotStudyEditorProvider } from './preview';
import { publish } from './publish';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(DotStudyEditorProvider.register(context));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        { language: "dotstudy-language" }, new DotStudySymbolProvider()
    ));

    context.subscriptions.push(commands.registerCommand('dotstudy.publish', publish));
}

export function deactivate() { }
