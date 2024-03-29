'use strict';
const discord = require("discord.js");
import * as vscode from 'vscode';
import path = require('path');
import { DiscordClient, DiscordMessage } from './discord';
import { recursiveSymbolProcessor } from './language';
import { getCurrentEditorPath, getCurrentEditorSymbols } from './util';

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
    ).filter(x => (x as any).type === discord.ChannelType.GuildText);

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

    const symbols = await new Promise((resolve, _reject) => {
        getCurrentEditorSymbols(null, symbols => {
            resolve(symbols);
        });
    }) as vscode.DocumentSymbol[];

    if (symbols.length === 0) {
        vscode.window.showErrorMessage("Reopen current study file in text editor and retry.");
        return;
    }

    const discordMessages: DiscordMessage[] = discordFormattedMessages(symbols);

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
                progress.report({ increment: i * step, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                await discordClient.sendMessage(channel, discordMessages[i]);
            }

            setTimeout(() => {
                progress.report({ increment: 100, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                resolve();
            }, discordMessages.length * 250 + 5);
        });

        return p;
    });
}

function discordFormattedMessages(symbols: vscode.DocumentSymbol[]): DiscordMessage[] {
    const currentEditorPath = getCurrentEditorPath();

    let messages: DiscordMessage[] = [new DiscordMessage("", "")];
    let i = 0;

    function newMessage() {
        messages.push(new DiscordMessage("", ""));
        i++;
    };

    function pushMessages(text: string) {
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
                messages[i].file = path.join(currentEditorPath, symbol.name);
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
