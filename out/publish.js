'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const vscode = require("vscode");
const discord_1 = require("./discord");
const language_1 = require("./language");
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
                let strings = discordFormattedString(symbols);
                let messages = discordSplitMessages(strings);
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
    let formattedStrings = [];
    let i = -1;
    // function stringifySymbols(symbol: vscode.DocumentSymbol) {
    //     switch (symbol.kind) {
    //         case vscode.SymbolKind.Class: {
    //             formattedStrings.push("");
    //             i++;
    //             formattedStrings[i] += `__**${symbol.name}**__\n`;
    //             break;
    //         }
    //         case vscode.SymbolKind.Method: {
    //             formattedStrings.push("");
    //             i++;
    //             formattedStrings[i] += `** **\n**${symbol.name}**\n`;
    //             break;
    //         }
    //         case vscode.SymbolKind.Field: {
    //             formattedStrings[i] += symbol.name;
    //             formattedStrings[i] += ` ||${symbol.detail}||\n`;
    //             break;
    //         }
    //     }
    //     for (const child of symbol.children) {
    //         stringifySymbols(child);
    //     }
    // }
    // stringifySymbols(symbols[0]);
    (0, language_1.recursiveSymbolProcessor)(symbols[0], {
        [vscode.SymbolKind.Class]: (symbol) => {
            formattedStrings.push("");
            i++;
            formattedStrings[i] += `__**${symbol.name}**__\n`;
        },
        [vscode.SymbolKind.Method]: (symbol) => {
            formattedStrings.push("");
            i++;
            formattedStrings[i] += `** **\n**${symbol.name}**\n`;
        },
        [vscode.SymbolKind.Field]: (symbol) => {
            formattedStrings[i] += symbol.name;
            formattedStrings[i] += ` ||${symbol.detail}||\n`;
        }
    });
    return formattedStrings;
}
function discordSplitMessages(strings) {
    let allMessages = [];
    for (const text of strings) {
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
        for (const message of messages) {
            allMessages.push(message);
        }
    }
    return allMessages;
}
//# sourceMappingURL=publish.js.map