'use strict';
import * as vscode from 'vscode';
import { DotStudyEditorProvider } from './preview';
import {DotStudySymbolProvider} from './language';

export function activate(context: vscode.ExtensionContext) { 
    context.subscriptions.push(DotStudyEditorProvider.register(context));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "dotstudy-language"}, new DotStudySymbolProvider()
    ));
}

export function deactivate() { }
