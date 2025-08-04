const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.json");

module.exports = {
    announce: {
        name: "announce",
        description: "Send an announcement to the announcement channel",
        usage: "!announce <message>",
        permissions: ["MANAGE_MESSAGES"],
        execute: async (message, args) => {
            if (!args.length) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(config.colors.error || 0xff0000)
                    .setTitle("❌ No announcement content provided")
                    .setDescription("Usage: `!announce <your message>`")
                    .setTimestamp();
                return message.reply({ embeds: [errorEmbed] });
            }

            const announcement = args.join(" ");

            // Find a channel with "announce" in its name
            const announcementChannel = message.guild.channels.cache.find(
                (ch) =>
                    ch.type === 0 && // Text channel
                    ch.name.toLowerCase().includes("announcement"),
            );

            if (!announcementChannel) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.colors.error || 0xff0000)
                            .setTitle("❌ Announcement Channel Not Found")
                            .setDescription(
                                'Please create a channel with "announce" in the name.',
                            )
                            .setTimestamp(),
                    ],
                });
            }

            // Delete the user's message (optional)
            try {
                if (message.deletable) await message.delete();
            } catch (err) {
                console.warn("Could not delete command message:", err.message);
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.announcement || 0x2ecc71)
                .setTitle("📢 Announcement")
                .setDescription(announcement)
                .setFooter({
                    text: `Announced by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp();

            try {
                await announcementChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error("Failed to send announcement:", error);
                return message.reply("❌ Failed to send announcement.");
            }
        },
    },
};
