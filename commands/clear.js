const { PermissionsBitField } = require("discord.js");

module.exports = {
    clear: {
        name: "clear",
        description: "Delete a number of messages in the current channel",
        usage: "!clear <amount>",
        permissions: ["MANAGE_MESSAGES"],
        execute: async (message, args) => {
            // Check if the user has permission
            if (
                !message.member.permissions.has(
                    PermissionsBitField.Flags.ManageMessages,
                )
            ) {
                return message.reply(
                    "You don't have permission to delete messages.",
                );
            }

            // Validate input
            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount < 1 || amount > 100) {
                return message.reply(
                    "Please provide a number between 1 and 100.",
                );
            }

            try {
                await message.channel.bulkDelete(amount, true);
                const msg = await message.channel.send(
                    `🧹 Deleted ${amount} messages.`,
                );
                setTimeout(() => msg.delete().catch(() => {}), 3000); // Auto-delete confirmation
            } catch (err) {
                console.error(err);
                message.reply(
                    "There was an error trying to delete messages in this channel.",
                );
            }
        },
    },
};
