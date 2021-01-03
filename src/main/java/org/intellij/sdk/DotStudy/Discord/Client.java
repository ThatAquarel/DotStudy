package org.intellij.sdk.DotStudy.Discord;

import discord4j.core.DiscordClientBuilder;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.lifecycle.ReadyEvent;
import discord4j.core.object.entity.User;
import org.intellij.sdk.DotStudy.Settings.AppSettingsState;

public class Client {
    public boolean login;
    public GatewayDiscordClient client;

    public Client() {
        AppSettingsState appSettingsState = AppSettingsState.getInstance();

        try {
            GatewayDiscordClient client = DiscordClientBuilder.create(appSettingsState.userId).build().login().block();

            assert client != null;
            client.getEventDispatcher().on(ReadyEvent.class)
                    .subscribe(event -> {
                        login = true;
                        //User self = event.getSelf();
                        //System.out.printf("Logged in as %s#%s%n", self.getUsername(), self.getDiscriminator());
                    });

            this.client = client;
        } catch (IllegalArgumentException | NullPointerException ignored) {
            login = false;
        }
    }

    public User getUser() {
        return client.getSelf().block();
    }
}
