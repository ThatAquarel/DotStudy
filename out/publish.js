'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const vscode = require("vscode");
const discord_1 = require("./discord");
const language_1 = require("./language");
async function publish() {
    const key = vscode.workspace.getConfiguration('').get("dotstudy.botAuthKey");
    if (key === null) {
        return;
    }
    ;
    let discordClient = await new Promise((resolve, _reject) => {
        new discord_1.DiscordClient(key, (_client) => {
            resolve(_client);
        });
    });
    const textChannels = Array.from(discordClient.client.channels.cache.values()).filter(x => x.type === "text");
    const items = textChannels.map(x => {
        return {
            label: x.name,
            description: (x.topic === null) ? "" : x.topic,
            _discordId: x.id
        };
    });
    const selection = await new Promise((resolve, _reject) => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = items;
        quickPick.onDidChangeSelection(selection => {
            resolve(selection[0]);
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    });
    const channel = selection._discordId;
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
        return;
    }
    ;
    const symbols = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", editor.document.uri);
    let path = editor?.document.fileName;
    path = (path === undefined) ? ".\\" : path;
    path = path.substring(0, path.lastIndexOf("\\") + 1);
    const discordMessages = discordFormattedMessages(symbols, path);
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "DotStudy Publish to Discord",
        cancellable: true
    }, (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("Canceled DotStudy Publish");
        });
        const p = new Promise(async (resolve) => {
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
exports.publish = publish;
function discordFormattedMessages(symbols, path) {
    let messages = [new discord_1.DiscordMessage("", "")];
    let i = 0;
    let newMessage = () => {
        messages.push(new discord_1.DiscordMessage("", ""));
        i++;
    };
    let pushMessages = (text) => {
        if (messages[i].text.length + text.length > 2000) {
            newMessage();
        }
        ;
        messages[i].text += text;
    };
    (0, language_1.recursiveSymbolProcessor)(symbols[0], {
        [vscode.SymbolKind.Class]: (symbol) => {
            pushMessages(`__**${symbol.name}**__\n`);
        },
        [vscode.SymbolKind.Method]: (symbol) => {
            pushMessages(`** **\n**${symbol.name}**\n`);
        },
        [vscode.SymbolKind.File]: (symbol) => {
            messages[i].file = path + symbol.name;
            newMessage();
        },
        [vscode.SymbolKind.Field]: (symbol) => {
            let text = symbol.name;
            let detail = symbol.detail.trim();
            if (detail !== "") {
                text += ` ||${detail}||`;
            }
            ;
            text += "\n";
            pushMessages(text);
        }
    });
    return messages;
}
//# sourceMappingURL=publish.js.map