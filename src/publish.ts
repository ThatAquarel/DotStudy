'use strict';
import * as vscode from 'vscode';
import { DiscordClient } from './discord';

export function publish() {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "DotStudy Publish to Discord",
        cancellable: true
    }, (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("Canceled DotStudy Publish");
        });

        const p = new Promise<void>(resolve => {
            let editor = vscode.window.activeTextEditor;
            if (editor === undefined) {
                resolve();
                return;
            };

            vscode.commands.executeCommand(
                "vscode.executeDocumentSymbolProvider",
                editor.document.uri
            ).then((values: unknown) => {
                let symbols = values as vscode.DocumentSymbol[];
                let text = discordFormattedString(symbols);
                let messages = discordSplitMessages(text);

                const key = vscode.workspace.getConfiguration('').get("dotstudy.botAuthKey") as string;
                const channel = vscode.workspace.getConfiguration('').get("dotstudy.publishChannel") as string;
                if (key === null || channel === null) {
                    resolve();
                    return;
                }

                new DiscordClient(key, (client: DiscordClient) => {
                    let step = Math.round(100 / messages.length);

                    for (let i = 0; i < messages.length; i++) {
                        setTimeout(() => {
                            progress.report({ increment: i * step, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                            client.sendMessage(channel, messages[i]);
                        }, i * 250);
                    }

                    setTimeout(() => {
                        progress.report({increment:100, message: vscode.window.activeTextEditor?.document.uri.fsPath});
                        resolve();
                    }, messages.length * 250 + 5);
                });
            });
        });

        return p;
    });
}

function discordFormattedString(symbols: vscode.DocumentSymbol[]): string {
    let text = "";

    function stringifySymbols(symbol: vscode.DocumentSymbol) {
        switch (symbol.kind) {
            case vscode.SymbolKind.Class: {
                text += `__**${symbol.name}**__`;
                break;
            }
            case vscode.SymbolKind.Method: {
                text += `** **\n**${symbol.name}**\n`;
                break;
            }
            case vscode.SymbolKind.Field: {
                text += symbol.name;
                text += ` ||${symbol.detail}||\n`;

                break;
            }
        }

        for (const child of symbol.children) {
            stringifySymbols(child);
        }
    }

    stringifySymbols(symbols[0]);

    return text;
}

function discordSplitMessages(text: string): string[] {
    let messages: string[] = [];

    let lineBreakIndices = [...text.matchAll(/\n/g)].map(match => match.index ?? -1);
    let lineBreakIndicesMod = lineBreakIndices.map((value) => { return value % 1500; });
    let startingIndex = 0;

    for (let i = 0; i < lineBreakIndices.length; i++) {
        let currentLineBreak = lineBreakIndicesMod[i];
        let nextLineBreak = lineBreakIndicesMod[i + 1];

        if (nextLineBreak === undefined) { nextLineBreak = -1; };

        if (currentLineBreak >= nextLineBreak) {
            messages.push(text.substring(startingIndex, lineBreakIndices[i] + 1));
            startingIndex = lineBreakIndices[i] + 1;
        }
    }

    return messages;
}
