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

    fetchChannel(channelId: string) {
        let _channel = channelId;
    }

    sendMessage(channelId: string, message: DiscordMessage) {
        const channel = this.client.channels.cache.find((a: { id: string; }) => a.id === channelId);
        channel.send(...message.getMessage());
    }
}

export class DiscordMessage {
    text: string;
    file: string;

    constructor(text: string, file: string) {
        this.text = text;
        this.file = file;
    }

    getMessage() {
        if (this.file !== "") {
            return [this.text, { files: [this.file] }];
        } else {
            return [this.text];
        }
    }
}
