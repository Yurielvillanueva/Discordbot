const fs = require("fs");
const path = require("path");

const DATA_DIR = "./data";
const TEMP_ROLES_FILE = path.join(DATA_DIR, "tempRoles.json");
const CONFESSIONS_FILE = path.join(DATA_DIR, "confessions.json");

/**
 * Initialize the database (create directories and files if they don't exist)
 */
function initDatabase() {
    try {
        // Create data directory if it doesn't exist
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            console.log("📁 Created data directory");
        }

        // Initialize temp roles file
        if (!fs.existsSync(TEMP_ROLES_FILE)) {
            fs.writeFileSync(TEMP_ROLES_FILE, JSON.stringify([], null, 2));
            console.log("📄 Created tempRoles.json");
        }

        // Initialize confessions file
        if (!fs.existsSync(CONFESSIONS_FILE)) {
            fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify([], null, 2));
            console.log("📄 Created confessions.json");
        }

        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
}

/**
 * Load temporary roles from file
 * @returns {Array} Array of temporary role objects
 */
function loadTempRoles() {
    try {
        const data = fs.readFileSync(TEMP_ROLES_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading temp roles:", error);
        return [];
    }
}

/**
 * Save temporary roles to file
 * @param {Array} tempRoles - Array of temporary role objects
 */
function saveTempRoles(tempRoles) {
    try {
        fs.writeFileSync(TEMP_ROLES_FILE, JSON.stringify(tempRoles, null, 2));
    } catch (error) {
        console.error("Error saving temp roles:", error);
    }
}

/**
 * Add a temporary role
 * @param {string} userId - User ID
 * @param {string} guildId - Guild ID
 * @param {string} roleId - Role ID
 * @param {number} expiresAt - Expiration timestamp
 */
function addTempRole(userId, guildId, roleId, expiresAt) {
    const tempRoles = loadTempRoles();
    tempRoles.push({
        userId,
        guildId,
        roleId,
        expiresAt,
        createdAt: Date.now()
    });
    saveTempRoles(tempRoles);
}

/**
 * Remove a temporary role
 * @param {string} userId - User ID
 * @param {string} guildId - Guild ID
 * @param {string} roleId - Role ID
 */
function removeTempRole(userId, guildId, roleId) {
    let tempRoles = loadTempRoles();
    tempRoles = tempRoles.filter(tr => 
        !(tr.userId === userId && tr.guildId === guildId && tr.roleId === roleId)
    );
    saveTempRoles(tempRoles);
}

/**
 * Get expired temporary roles
 * @returns {Array} Array of expired temporary role objects
 */
function getExpiredTempRoles() {
    const tempRoles = loadTempRoles();
    const now = Date.now();
    return tempRoles.filter(tr => tr.expiresAt <= now);
}

/**
 * Clean up expired temporary roles
 */
function cleanupExpiredTempRoles() {
    let tempRoles = loadTempRoles();
    const now = Date.now();
    tempRoles = tempRoles.filter(tr => tr.expiresAt > now);
    saveTempRoles(tempRoles);
}

/**
 * Load confessions from file
 * @returns {Array} Array of confession objects
 */
function loadConfessions() {
    try {
        const data = fs.readFileSync(CONFESSIONS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading confessions:", error);
        return [];
    }
}

/**
 * Save confessions to file
 * @param {Array} confessions - Array of confession objects
 */
function saveConfessions(confessions) {
    try {
        fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify(confessions, null, 2));
    } catch (error) {
        console.error("Error saving confessions:", error);
    }
}

/**
 * Add a new confession
 * @param {string} guildId - Guild ID
 * @param {string} channelId - Channel ID
 * @param {string} content - Confession content
 * @param {string} userId - User ID (for tracking, not displayed)
 */
function addConfession(guildId, channelId, content, userId) {
    const confessions = loadConfessions();
    const confession = {
        id: confessions.length + 1,
        guildId,
        channelId,
        content,
        userId,
        timestamp: Date.now()
    };
    confessions.push(confession);
    saveConfessions(confessions);
    return confession;
}

module.exports = {
    initDatabase,
    loadTempRoles,
    saveTempRoles,
    addTempRole,
    removeTempRole,
    getExpiredTempRoles,
    cleanupExpiredTempRoles,
    loadConfessions,
    saveConfessions,
    addConfession
};
