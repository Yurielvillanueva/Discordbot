const config = require("../config.json");

/**
 * Check if a member has the required permissions
 * @param {GuildMember} member - The guild member to check
 * @param {string[]} requiredPermissions - Array of required permission strings
 * @returns {boolean} - Whether the member has the required permissions
 */
function checkPermissions(member, requiredPermissions) {
    if (!member || !requiredPermissions) return false;

    // Bot owner override
    if (member.id === config.botOwner) return true;

    // Administrator override
    if (member.permissions.has("Administrator")) return true;

    // Check each required permission
    for (const permission of requiredPermissions) {
        if (!member.permissions.has(permission)) {
            return false;
        }
    }

    return true;
}

/**
 * Check if the bot has the required permissions
 * @param {Guild} guild - The guild to check permissions in
 * @param {string[]} requiredPermissions - Array of required permission strings
 * @returns {boolean} - Whether the bot has the required permissions
 */
function checkBotPermissions(guild, requiredPermissions) {
    if (!guild || !requiredPermissions) return false;

    const botMember = guild.members.me;
    if (!botMember) return false;

    // Check each required permission
    for (const permission of requiredPermissions) {
        if (!botMember.permissions.has(permission)) {
            return false;
        }
    }

    return true;
}

/**
 * Get missing permissions for a member
 * @param {GuildMember} member - The guild member to check
 * @param {string[]} requiredPermissions - Array of required permission strings
 * @returns {string[]} - Array of missing permissions
 */
function getMissingPermissions(member, requiredPermissions) {
    if (!member || !requiredPermissions) return [];

    // Bot owner has all permissions
    if (member.id === config.botOwner) return [];

    // Administrator has all permissions
    if (member.permissions.has("Administrator")) return [];

    const missing = [];
    for (const permission of requiredPermissions) {
        if (!member.permissions.has(permission)) {
            missing.push(permission);
        }
    }

    return missing;
}

module.exports = {
    checkPermissions,
    checkBotPermissions,
    getMissingPermissions
};
