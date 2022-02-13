"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMessage = exports.DiscordClient = void 0;
const discord = require('discord.js');
class DiscordClient {
    constructor(authKey, callback) {
        this.client = new discord.Client();
        this.client.login(authKey);
        this.client.on('ready', () => {
            callback(this);
        });
    }
    fetchChannel(channelId) {
        let _channel = channelId;
    }
    sendMessage(channelId, message) {
        const channel = this.client.channels.cache.find((a) => a.id === channelId);
        channel.send(...message.getMessage());
    }
}
exports.DiscordClient = DiscordClient;
class DiscordMessage {
    constructor(text, file) {
        this.text = text;
        this.file = file;
    }
    getMessage() {
        if (this.file !== "") {
            return [this.text, { files: [this.file] }];
        }
        else {
            return [this.text];
        }
    }
}
exports.DiscordMessage = DiscordMessage;
//# sourceMappingURL=discord.js.map