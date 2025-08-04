const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");
const { addTempRole, removeTempRole, getExpiredTempRoles, cleanupExpiredTempRoles } = require("../utils/database");
const { checkBotPermissions } = require("../utils/permissions");

// Start temp role cleanup interval
setInterval(() => {
    cleanupExpiredTempRoles();
}, 60000); // Check every minute

const addrole = {
    name: "addrole",
    description: "Add a role to a user",
    usage: "!addrole @user @role",
    permissions: ["ManageRoles"],
    async execute(message, args, client) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription("Usage: `!addrole @user @role`")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check bot permissions
        if (!checkBotPermissions(message.guild, ["ManageRoles"])) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Missing Bot Permissions")
                .setDescription("I need the `Manage Roles` permission to use this command.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const targetUser = message.mentions.members.first();
        const role = message.mentions.roles.first();

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ User Not Found")
                .setDescription("Please mention a valid user.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Role Not Found")
                .setDescription("Please mention a valid role.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check role hierarchy
        if (role.position >= message.guild.members.me.roles.highest.position) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Role Hierarchy Error")
                .setDescription("I cannot assign roles higher than or equal to my highest role.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (targetUser.roles.cache.has(role.id)) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle("⚠️ Role Already Assigned")
                .setDescription(`${targetUser.user.tag} already has the ${role.name} role.`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            await targetUser.roles.add(role);
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle("✅ Role Added")
                .setDescription(`Successfully added the ${role.name} role to ${targetUser.user.tag}.`)
                .setTimestamp();
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error adding role:", error);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Error")
                .setDescription("An error occurred while adding the role.")
                .setTimestamp();
            message.reply({ embeds: [embed] });
        }
    }
};

const removerole = {
    name: "removerole",
    description: "Remove a role from a user",
    usage: "!removerole @user @role",
    permissions: ["ManageRoles"],
    async execute(message, args, client) {
        if (args.length < 2) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription("Usage: `!removerole @user @role`")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check bot permissions
        if (!checkBotPermissions(message.guild, ["ManageRoles"])) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Missing Bot Permissions")
                .setDescription("I need the `Manage Roles` permission to use this command.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const targetUser = message.mentions.members.first();
        const role = message.mentions.roles.first();

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ User Not Found")
                .setDescription("Please mention a valid user.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Role Not Found")
                .setDescription("Please mention a valid role.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!targetUser.roles.cache.has(role.id)) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle("⚠️ Role Not Found")
                .setDescription(`${targetUser.user.tag} doesn't have the ${role.name} role.`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            await targetUser.roles.remove(role);
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle("✅ Role Removed")
                .setDescription(`Successfully removed the ${role.name} role from ${targetUser.user.tag}.`)
                .setTimestamp();
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error removing role:", error);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Error")
                .setDescription("An error occurred while removing the role.")
                .setTimestamp();
            message.reply({ embeds: [embed] });
        }
    }
};

const temprole = {
    name: "temprole",
    description: "Give a user a temporary role",
    usage: "!temprole @user @role <duration in minutes>",
    permissions: ["ManageRoles"],
    async execute(message, args, client) {
        if (args.length < 3) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription("Usage: `!temprole @user @role <duration in minutes>`")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check bot permissions
        if (!checkBotPermissions(message.guild, ["ManageRoles"])) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Missing Bot Permissions")
                .setDescription("I need the `Manage Roles` permission to use this command.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const targetUser = message.mentions.members.first();
        const role = message.mentions.roles.first();
        const duration = parseInt(args[2]);

        if (!targetUser) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ User Not Found")
                .setDescription("Please mention a valid user.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (!role) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Role Not Found")
                .setDescription("Please mention a valid role.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        if (isNaN(duration) || duration <= 0) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Duration")
                .setDescription("Please provide a valid duration in minutes (positive number).")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        // Check role hierarchy
        if (role.position >= message.guild.members.me.roles.highest.position) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Role Hierarchy Error")
                .setDescription("I cannot assign roles higher than or equal to my highest role.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        try {
            await targetUser.roles.add(role);
            
            const expiresAt = Date.now() + (duration * 60 * 1000);
            addTempRole(targetUser.id, message.guild.id, role.id, expiresAt);

            // Schedule role removal
            setTimeout(async () => {
                try {
                    const member = await message.guild.members.fetch(targetUser.id);
                    if (member && member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                        removeTempRole(targetUser.id, message.guild.id, role.id);
                    }
                } catch (error) {
                    console.error("Error removing temporary role:", error);
                }
            }, duration * 60 * 1000);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle("✅ Temporary Role Added")
                .setDescription(`Successfully added the ${role.name} role to ${targetUser.user.tag} for ${duration} minutes.`)
                .setTimestamp();
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error adding temporary role:", error);
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Error")
                .setDescription("An error occurred while adding the temporary role.")
                .setTimestamp();
            message.reply({ embeds: [embed] });
        }
    }
};

module.exports = {
    addrole,
    removerole,
    temprole
};
