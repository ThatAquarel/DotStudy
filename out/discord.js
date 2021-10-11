"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordClient = void 0;
const discord = require('discord.js');
class DiscordClient {
    constructor(authKey, callback) {
        this.client = new discord.Client();
        this.client.login(authKey);
        this.client.on('ready', () => {
            callback(this);
        });
    }
    sendMessage(channelId, message) {
        const channel = this.client.channels.cache.find((a) => a.id === channelId);
        channel.send(message);
    }
}
exports.DiscordClient = DiscordClient;
//# sourceMappingURL=discord.js.map