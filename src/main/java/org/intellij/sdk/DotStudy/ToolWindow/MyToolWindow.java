package org.intellij.sdk.DotStudy.ToolWindow;

import com.intellij.openapi.project.Project;
import com.intellij.ui.JBColor;
import com.intellij.util.ui.JBFont;
import discord4j.core.object.entity.Guild;
import discord4j.core.object.entity.User;
import discord4j.core.object.entity.channel.Channel;
import discord4j.core.object.entity.channel.GuildChannel;
import discord4j.core.object.entity.channel.TextChannel;
import org.intellij.sdk.DotStudy.Discord.Client;
import org.intellij.sdk.DotStudy.Util.FormatUtil;
import org.intellij.sdk.DotStudy.Util.ImageUtil;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MyToolWindow {

    private final Map<Guild, List<GuildChannel>> servers = new HashMap<>();
    private JButton send;
    private JButton update;
    private JComboBox<String> server;
    private JComboBox<String> channel;
    private JLabel label;
    private JPanel window;
    private JTextArea preview;
    private JScrollPane viewport;
    private Guild selectedGuild;
    private GuildChannel selectedGuildChannel;

    public MyToolWindow(Project project) {
        new FileListener(this, project);
        Client client = new Client();

        prepareGui(client, project);
    }

    public void prepareGui(Client client, Project project) {
        if (client.login) {
            send.setEnabled(true);
            update.setEnabled(true);
            server.setEnabled(true);
            channel.setEnabled(true);
            preview.setEnabled(true);
            viewport.setEnabled(true);

//            server.removeAll();
//            channel.removeAll();
//            servers.clear();

            createGui(client);

            server.addActionListener(e -> setSelectedGuild());
            channel.addActionListener(e -> setSelectedGuildChannel());
            send.addActionListener(e -> send(client));
            update.addActionListener(e -> updatePreview(project));
            preview.setBackground(JBColor.background());
            preview.setFont(JBFont.getFont(JBFont.DIALOG));

            updatePreview(project);
        } else {
            loginFailed();
        }
    }

    public void send(Client client) {
        Guild guild = client.client.getGuildById(selectedGuild.getId()).block();
        assert guild != null;
        TextChannel textChannel = (TextChannel) guild.getChannelById(selectedGuildChannel.getId()).block();
        assert textChannel != null;


        String[] messages = preview.getText().split("\n");

        StringBuilder sendMessage = new StringBuilder();

        for (String message : messages) {
            String appendMessage = message + "\n";
            if (appendMessage.length() + sendMessage.length() >= 2000) {
                textChannel.createMessage(sendMessage.toString()).subscribe();
                sendMessage.setLength(0);
            }
            sendMessage.append(appendMessage);
        }
        if (sendMessage.length() <= 2000) {
            textChannel.createMessage(sendMessage.toString()).subscribe();
        }
    }

    public void updatePreview(Project project) {
        ArrayList<String> messages = FormatUtil.getMessages(project);

        if (messages.isEmpty()) {
            preview.setText("Preview Unavailable");
        } else {
            preview.setText("");

            for (String message : messages) {
                preview.append(message + "\n");
            }

            window.revalidate();
        }
    }

    public void setSelectedGuild() {
        for (Guild guild : servers.keySet()) {
            if (guild.getName().equals(server.getSelectedItem())) {
                selectedGuild = guild;
                //System.out.print(selectedGuild.getName());
                break;
            }
        }

        loadChannels();
    }

    public void setSelectedGuildChannel() {
        for (GuildChannel guildChannel : servers.get(selectedGuild)) {
            if (guildChannel.getName().equals(channel.getSelectedItem())) {
                selectedGuildChannel = guildChannel;
                //System.out.print(selectedGuildChannel.getName());
                break;
            }
        }
    }

    public void createGui(Client client) {
        //Label User
        User user = client.getUser();
        label.setText(user.getTag());
        try {
            URL url = new URL(user.getAvatarUrl());
            BufferedImage image = ImageIO.read(url);
            label.setIcon(new ImageIcon(ImageUtil.getScaledImage(new ImageIcon(image).getImage(), 32, 32)));
        } catch (IOException ignored) {
        }

        //Guilds
        List<Guild> guilds = client.client.getGuilds().collectList().block();
        assert guilds != null;
        selectedGuild = guilds.get(0);
        for (Guild guild : guilds) {
            server.addItem(guild.getName());

            List<GuildChannel> channels = guild.getChannels().collectList().block();
            servers.put(guild, channels);
        }

        loadChannels();
    }

    private void loadChannels() {
        channel.removeAllItems();

        List<GuildChannel> channels = servers.get(selectedGuild);
        assert channels != null;
        selectedGuildChannel = channels.get(0);
        for (GuildChannel guildChannel : channels) {
            if (guildChannel.getType().equals(Channel.Type.GUILD_TEXT)) {
                channel.addItem(guildChannel.getName());
            }
        }

        window.revalidate();
    }

    private void loginFailed() {
        send.setEnabled(false);
        update.setEnabled(false);
        server.setEnabled(false);
        channel.setEnabled(false);
        preview.setEnabled(false);
        viewport.setEnabled(false);
        label.setText("Settings > Tools > DotStudy > Client Id");
        label.setIcon(null);
        preview.setText("Preview Unavailable");
    }

    public JPanel getContent() {
        return window;
    }
}
