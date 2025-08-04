const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
    disconnect: {
        name: "disconnect",
        description: "Disconnect a user from voice channel",
        usage: "!disconnect @user",
        permissions: ["MOVE_MEMBERS"], // Bot and user need this
        execute: async (message, args) => {
            const target = message.mentions.members.first();

            if (!target) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle("❌ Invalid Usage")
                    .setDescription(
                        "You need to mention a user to disconnect.\nUsage: `!disconnect @user`",
                    )
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }

            if (!target.voice.channel) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle("⚠️ User Not in Voice")
                    .setDescription(
                        `${target.user.tag} is not in a voice channel.`,
                    )
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }

            try {
                await target.voice.disconnect(); // disconnects from VC

                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle("✅ Disconnected")
                    .setDescription(
                        `${target.user.tag} has been disconnected from the voice channel.`,
                    )
                    .setTimestamp();
                message.reply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle("❌ Failed to Disconnect")
                    .setDescription(
                        `I couldn't disconnect the user. Make sure I have **MOVE_MEMBERS** permission.`,
                    )
                    .setTimestamp();
                message.reply({ embeds: [embed] });
            }
        },
    },
};
