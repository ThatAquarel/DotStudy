const discord = require('discord.js');
import path = require("path");
//import { Client, GatewayIntentBits } from "discord.js";

export class DiscordClient {
    client: any;

    constructor(authKey: string, callback: (client: DiscordClient) => void) {
        this.client = new discord.Client({
            intents: [
                discord.GatewayIntentBits.Guilds,
        		discord.GatewayIntentBits.GuildMessages,
		        discord.GatewayIntentBits.MessageContent,
                discord.GatewayIntentBits.GuildPresences
            ]
        });
        this.client.login(authKey);

        this.client.on('ready', () => {
            callback(this);
        });
    }

    fetchChannel(channelId: string) {
        let _channel = channelId;
    }

    sendMessage(channelId: string, message: DiscordMessage): Promise<any> {
        const channel = this.client.channels.cache.find((a: { id: string; }) => a.id === channelId);
        return channel.send(message.getMessage());
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
            return { 
                content: this.text,
                files: [
                    {
                        attachment: this.file.split("\\").join("/"),
                        name: path.basename(this.file),
                    }
                ] 
            };
        } else {
            return {
                content: this.text
            };
        }
    }
}
