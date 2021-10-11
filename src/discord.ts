const discord = require('discord.js');

export class DiscordClient {
    client: any;

    constructor(authKey: string, callback: (client: DiscordClient) => void) {
        this.client = new discord.Client();
        this.client.login(authKey);

        this.client.on('ready', () => {
            callback(this);
        });
    }

    sendMessage(channelId: string, message: string) {
        const channel = this.client.channels.cache.find((a: { id: string; }) => a.id === channelId);
        channel.send(message);
    }
}
