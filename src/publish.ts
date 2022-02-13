'use strict';
import * as vscode from 'vscode';
import { DiscordClient, DiscordMessage } from './discord';
import { recursiveSymbolProcessor } from './language';

interface ChannelPickItem extends vscode.QuickPickItem {
    _discordId: string;
}

export async function publish() {
    const key = vscode.workspace.getConfiguration('').get("dotstudy.botAuthKey") as string;
    if (key === null) { return; };

    let discordClient: DiscordClient = await new Promise((resolve, _reject) => {
        new DiscordClient(key, (_client: DiscordClient) => {
            resolve(_client);
        });
    });

    const textChannels: any[] = Array.from(
        discordClient.client.channels.cache.values()
    ).filter(x => (x as any).type === "text");

    const items = textChannels.map(x => {
        return {
            label: x.name,
            description: (x.topic === null) ? "" : x.topic,
            _discordId: x.id
        };
    });

    const selection: vscode.QuickPickItem = await new Promise((resolve, _reject) => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.onDidChangeSelection(selection => {
            resolve(selection[0]);
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    });

    const channel = (selection as ChannelPickItem)._discordId;

    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) { return; };

    const symbols = await vscode.commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        editor.document.uri
    ) as vscode.DocumentSymbol[];

    let path = editor?.document.fileName;
    path = (path === undefined) ? ".\\" : path;
    path = path.substring(0, path.lastIndexOf("\\") + 1);

    const discordMessages: DiscordMessage[] = discordFormattedMessages(symbols, path);

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "DotStudy Publish to Discord",
        cancellable: true
    }, (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("Canceled DotStudy Publish");
        });
        const p = new Promise<void>(async resolve => {
            const step = Math.round(100 / discordMessages.length);
            for (let i = 0; i < discordMessages.length; i++) {
                setTimeout(() => {
                    progress.report({ increment: i * step, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                    discordClient.sendMessage(channel, discordMessages[i]);
                }, i * 250);
            }

            setTimeout(() => {
                progress.report({ increment: 100, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                resolve();
            }, discordMessages.length * 250 + 5);
        });

        return p;
    });
}

function discordFormattedMessages(symbols: vscode.DocumentSymbol[], path: string): DiscordMessage[] {
    let messages: DiscordMessage[] = [new DiscordMessage("", "")];
    let i = 0;

    let newMessage = () => {
        messages.push(new DiscordMessage("", ""));
        i++;
    };

    let pushMessages = (text: string) => {
        if (messages[i].text.length + text.length > 2000) { newMessage(); };
        messages[i].text += text;
    };

    recursiveSymbolProcessor(
        symbols[0],
        {
            [vscode.SymbolKind.Class]: (symbol: vscode.DocumentSymbol) => {
                pushMessages(`__**${symbol.name}**__\n`);
            },
            [vscode.SymbolKind.Method]: (symbol: vscode.DocumentSymbol) => {
                pushMessages(`** **\n**${symbol.name}**\n`);
            },
            [vscode.SymbolKind.File]: (symbol: vscode.DocumentSymbol) => {
                messages[i].file = path + symbol.name;
                newMessage();
            },
            [vscode.SymbolKind.Field]: (symbol: vscode.DocumentSymbol) => {
                let text = symbol.name;
                let detail = symbol.detail.trim();
                if (detail !== "") { text += ` ||${detail}||`; };
                text += "\n";

                pushMessages(text);
            }
        }
    );

    return messages;
}
