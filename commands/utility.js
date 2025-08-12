            const { EmbedBuilder } = require("discord.js");
            const config = require("../config.json");
            const { addConfession } = require("../utils/database");

            const help = {
                name: "help",
                description: "Display help information",
                usage: "!help [command]",
                async execute(message, args, client) {
                    const isAdmin = message.member.permissions.has("Administrator");

                    if (args.length === 0) {
                        const embed = new EmbedBuilder()
                            .setColor(config.colors.primary)
                            .setTitle(`🚀 ${config.botName} Help`)
                            .setDescription(`${config.botName} v${config.version} - A multi-purpose Discord bot`)
                            .addFields(
                                {
                                    name: "🛡️ Moderation Commands",
                                    value: isAdmin
                                        ? "`addrole`, `removerole`, `temprole`, `clear`, `say`, `kick`, `ban`, `mute`, `unmute`, `warn`"
                                        : "**Admin Only!**",
                                    inline: false,
                                },
                                {
                                    name: "🎮 Fun Commands",
                                    value: "`8ball`, `joke`, `coinflip`, `roll`, `rps`, `roast`, `catfact`, `compliment`, `fortune`, `anime`",
                                    inline: false,
                                },
                                {
                                    name: "🔧 Utility Commands",
                                    value: "`help`, `ping`, `confess`, `userinfo`, `serverinfo`, `avatar`",
                                    inline: false,
                                },
                                {
                                    name: "Usage",
                                    value: `Use \`${config.prefix}help <command>\` for detailed information about a specific command.`,
                                    inline: false,
                                },
                                {
                                    name: "**Admin Only**",
                                    value: "**Some commands are restricted to administrators only.**",
                                    inline: false,
                                }
                            )
                            .setFooter({ text: `Prefix: ${config.prefix}` })
                            .setTimestamp();

                        return message.reply({ embeds: [embed] });
                    }

                    // Specific command help
                    const commandName = args[0].toLowerCase();
                    const command = client.commands.get(commandName);

                    if (!command) {
                        const embed = new EmbedBuilder()
                            .setColor(config.colors.error)
                            .setTitle("❌ Command Not Found")
                            .setDescription(`Command \`${commandName}\` not found.`)
                            .setTimestamp();
                        return message.reply({ embeds: [embed] });
                    }

                    const embed = new EmbedBuilder()
                        .setColor(config.colors.info)
                        .setTitle(`📖 Command: ${command.name}`)
                        .setDescription(command.description || "No description available.")
                        .addFields({
                            name: "Usage",
                            value: command.usage || `${config.prefix}${command.name}`,
                            inline: false,
                        })
                        .setTimestamp();

                    if (command.permissions && command.permissions.length > 0) {
                        embed.addFields({
                            name: "Required Permissions",
                            value: command.permissions.join(", "),
                            inline: false,
                        });
                    }

                    message.reply({ embeds: [embed] });
                },
            };

            const ping = {
                name: "ping",
                description: "Check the bot's latency",
                usage: "!ping",
                async execute(message, args, client) {
                    const sent = await message.reply("🏓 Pinging...");
                    const timeDiff = sent.createdTimestamp - message.createdTimestamp;

                    const embed = new EmbedBuilder()
                        .setColor(config.colors.success)
                        .setTitle("🏓 Pong!")
                        .addFields(
                            { name: "Bot Latency", value: `${timeDiff}ms`, inline: true },
                            { name: "API Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true }
                        )
                        .setTimestamp();

                    sent.edit({ content: "", embeds: [embed] });
                },
            };

const confess = {
    name: "confess",
    description: "Submit an anonymous confession",
    usage: "!confess <message>",
    async execute(message, args, client) {
        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription(`Usage: \`${config.prefix}confess <message>\``)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const confession = args.join(" ");

        if (confession.length > 1000) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Message Too Long")
                .setDescription("Confession must be 1000 characters or less.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            await message.delete();

            // Save the confession in your database
            const confessionData = addConfession(
                message.guild.id,
                message.channel.id,
                confession,
                message.author.id
            );

            // Build the confession embed
            const confessionEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle("📝 Anonymous Confession")
                .setDescription(confession)
                .setFooter({ text: `Confession #${confessionData?.id || "?"}` })
                .setTimestamp();

            // If you have a dedicated confession channel, fetch it
            const confessionChannelId = config.confessionChannelId; // Add this to your config
            const confessionChannel = confessionChannelId
                ? message.guild.channels.cache.get(confessionChannelId)
                : message.channel;

            // Send the confession embed to the right channel
            await confessionChannel.send({ embeds: [confessionEmbed] });

            // Try to DM the user confirmation
            try {
                const dmEmbed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setTitle("✅ Confession Submitted")
                    .setDescription("Your anonymous confession has been posted successfully.")
                    .setTimestamp();

                await message.author.send({ embeds: [dmEmbed] });
            } catch (dmError) {
                console.log(`Could not send DM to ${message.author.tag}`);
            }

        } catch (error) {
            console.error("Error processing confession:", error);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Error")
                .setDescription("An error occurred while processing your confession.")
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }
    },
};


            const serverinfo = {
                name: "serverinfo",
                description: "Display server information",
                usage: "!serverinfo",
                async execute(message, args, client) {
                    const guild = message.guild;

                    const embed = new EmbedBuilder()
                        .setColor(config.colors.info)
                        .setTitle(`📊 ${guild.name} Server Info`)
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .addFields(
                            { name: "Server Name", value: guild.name, inline: true },
                            { name: "Server ID", value: guild.id, inline: true },
                            { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
                            { name: "Members", value: guild.memberCount.toString(), inline: true },
                            { name: "Channels", value: guild.channels.cache.size.toString(), inline: true },
                            { name: "Roles", value: guild.roles.cache.size.toString(), inline: true },
                            { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
                        )
                        .setTimestamp();

                    if (guild.description) {
                        embed.setDescription(guild.description);
                    }

                    message.reply({ embeds: [embed] });
                },
            };

const userinfo = {
    name: "userinfo",
    description: "Display user information",
    usage: "!userinfo [@user]",
    async execute(message, args, client) {
        const targetMember = message.mentions.members.first() || message.member;
        const user = targetMember.user;

        const embed = new EmbedBuilder()
            .setColor(config.colors.info || "Blue")
            .setTitle(`👤 User Info: ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Username", value: user.username, inline: true },
                { name: "Discriminator", value: `#${user.discriminator}`, inline: true },
                { name: "User ID", value: user.id, inline: true },
                { name: "Nickname", value: targetMember.nickname || "None", inline: true },
                {
                    name: "Account Created",
                    value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                    inline: false,
                },
                {
                    name: "Joined Server",
                    value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:F>`,
                    inline: false,
                },
                {
                    name: "Roles",
                    value: targetMember.roles.cache
                        .filter(role => role.id !== message.guild.id)
                        .map(role => `<@&${role.id}>`)
                        .join(", ") || "None",
                    inline: false,
                }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};


            module.exports = {
                help,
                ping,
                confess,
                serverinfo,
                userinfo
            };
