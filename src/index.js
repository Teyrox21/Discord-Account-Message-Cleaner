// * Requirements
const { Client } = require("discord.js-selfbot-v13"),
    { token, cooldown } = require("../config.json");

// * Initializations
const client = new Client({
    partials: ["CHANNEL", "MESSAGE"]
});

// * Events

client.on("ready", () => {
    console.log(`❁𝄆𝅦𝅦- Discord Account Message Cleaner - 𝅦𝄇❁\nBy: Teyrox21 on GitHub ;)\n\n-=-=-=-=-= =-=-=-=-=-\n\nSession initiated with: ${client.user.username}\nMessage deletion cooldown (Avoid RateLimits): ${cooldown}ms\n\n===============\nCommands:\n-cleanall: Deletes all possible messages in ALL possible text channels, including private chats and server channels.\n-cleanthis: Deletes all messages from the channel where it is used.\n\n===============================\n\n`);
});

client.on("messageCreate", async (message) => {
    if (message.author.id !== client.user.id) return;

    // * -cleanall Command
    if (message.content == "-cleanall") {
        let i = 0,
            messageCount = 0,
            unknownChannels = 0;

        client.channels.cache.filter((thisChannel) => thisChannel && thisChannel.isText()).forEach(async (channel) => {
            try {
                let messages = await channel.messages.fetch({ cache: true, limit: 100, });
                messages = messages.filter((thisMessage) => thisMessage.author.id == client.user.id);

                // Bulk message deletion
                console.log(`[*] Detected ${messages.size} messages in ${channel.id} channel.`);

                messages.forEach((thisMessage) => {
                    i++;
                    setTimeout(() => {
                        thisMessage.delete().then(() => {
                            console.log(`✔ Message ${thisMessage.id} deleted.`);
                            messageCount++;
                        }).catch((e) => {
                            console.log(`❌ ${thisMessage.id} Could not be eliminated.`);
                            unknownChannels++;
                        });
                    }, (cooldown + Math.floor(Math.random() * 600)) * i);
                });
            } catch (e) {
                console.log(`[X] I cannot see messages on channel ${channel.id}`);
            } finally {
                // ! console.log(`\n\n\n\n[=] Run finished.\n\nDeleted messages: ${messageCount}\nChannels where I could not check: ${unknownChannels}`);
            }
        });
    }

    // * -cleanthis Command
    if (message.content == "-cleanthis") {
        const channel = message.channel;
        let i = 0,
            messageCount = 0,
            unknownMessages = 0,
            messages = await channel.messages.fetch({ cache: true, limit: 100 });

        messages = messages.filter((thisMessage) => thisMessage.author.id == client.user.id);

        try {
            // Bulk message deletion
            console.log(`[*] Detected ${messages.size} messages in ${channel.id} channel.`);
            messages.forEach((thisMessage) => {
                i++;
                setTimeout(() => {
                    thisMessage.delete().then(() => {
                        console.log(`✔ Message ${thisMessage.id} deleted.`);
                        messageCount++;
                    }).catch((e) => {
                        console.log(`❌ ${thisMessage.id} Could not be eliminated.`);
                        unknownMessages++;
                    });
                }, (cooldown + Math.floor(Math.random() * 500)) * i);
            });
        } catch (e) {
            console.log(`[X] I cannot delete.`);
        } finally {
            // ! console.log(`\n\n\n\n[=] Run finished.\n\nDeleted messages: ${messageCount}\nMessages that I could not delete: ${unknownMessages}`);
        }
    }
});

// * Login
client.login(token);
