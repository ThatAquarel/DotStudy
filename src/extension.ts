import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {}

    for (const cell of data.cells) {
      contents.push({
        kind: cell.kind,
        language: cell.languageId,
        value: cell.value
      });
    }
