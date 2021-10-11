'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const vscode = require("vscode");
const discord_1 = require("./discord");
function publish() {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "DotStudy Publish to Discord",
        cancellable: true
    }, (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("Canceled DotStudy Publish");
        });
        const p = new Promise(resolve => {
            let editor = vscode.window.activeTextEditor;
            if (editor === undefined) {
                resolve();
                return;
            }
            ;
            vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", editor.document.uri).then((values) => {
                let symbols = values;
                let text = discordFormattedString(symbols);
                let messages = discordSplitMessages(text);
                const key = vscode.workspace.getConfiguration('').get("dotstudy.botAuthKey");
                const channel = vscode.workspace.getConfiguration('').get("dotstudy.publishChannel");
                if (key === null || channel === null) {
                    resolve();
                    return;
                }
                new discord_1.DiscordClient(key, (client) => {
                    let step = Math.round(100 / messages.length);
                    for (let i = 0; i < messages.length; i++) {
                        setTimeout(() => {
                            progress.report({ increment: i * step, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                            client.sendMessage(channel, messages[i]);
                        }, i * 250);
                    }
                    setTimeout(() => {
                        progress.report({ increment: 100, message: vscode.window.activeTextEditor?.document.uri.fsPath });
                        resolve();
                    }, messages.length * 250 + 5);
                });
            });
        });
        return p;
    });
}
exports.publish = publish;
function discordFormattedString(symbols) {
    let text = "";
    function stringifySymbols(symbol) {
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
function discordSplitMessages(text) {
    let messages = [];
    let lineBreakIndices = [...text.matchAll(/\n/g)].map(match => match.index ?? -1);
    let lineBreakIndicesMod = lineBreakIndices.map((value) => { return value % 1500; });
    let startingIndex = 0;
    for (let i = 0; i < lineBreakIndices.length; i++) {
        let currentLineBreak = lineBreakIndicesMod[i];
        let nextLineBreak = lineBreakIndicesMod[i + 1];
        if (nextLineBreak === undefined) {
            nextLineBreak = -1;
        }
        ;
        if (currentLineBreak >= nextLineBreak) {
            messages.push(text.substring(startingIndex, lineBreakIndices[i] + 1));
            startingIndex = lineBreakIndices[i] + 1;
        }
    }
    return messages;
}
//# sourceMappingURL=publish.js.map