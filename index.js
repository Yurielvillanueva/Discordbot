const {
    Client,
    GatewayIntentBits,
    Collection,
    EmbedBuilder,
    ActivityType,
} = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const { checkPermissions } = require("./utils/permissions");
const { initDatabase } = require("./utils/database");

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Command collection
client.commands = new Collection();

// Load commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const commands = require(`./commands/${file}`);
    for (const name in commands) {
        if (!client.commands.has(name)) {
            client.commands.set(name, commands[name]);
        } else {
            console.warn(`⚠️ Duplicate command skipped: ${name}`);
        }
    }
}

// When bot is ready
client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`🔗 Connected to ${client.guilds.cache.size} servers`);

    initDatabase();
    client.user.setActivity("with the cosmos | !help", { type: ActivityType.Playing });
});

// Prevent duplicate execution with cooldown
const cooldowns = new Map();

// Handle commands
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    // Parse command and arguments
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    // Check cooldowns
    const cooldownKey = `${message.author.id}-${commandName}`;
    const commandCooldown = config.cooldowns[commandName] || config.cooldowns.default;
    
    if (cooldowns.has(cooldownKey)) {
        const expirationTime = cooldowns.get(cooldownKey) + commandCooldown;
        if (Date.now() < expirationTime) {
            const timeLeft = (expirationTime - Date.now()) / 1000;
            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle("⏰ Cooldown Active")
                .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before using \`${commandName}\` again.`)
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
    }

    // Set cooldown
    cooldowns.set(cooldownKey, Date.now());
    setTimeout(() => cooldowns.delete(cooldownKey), commandCooldown);

    try {
        // Check permissions
        if (command.permissions && !checkPermissions(message.member, command.permissions)) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Permission Denied")
                .setDescription(
                    `You need the following permissions: ${command.permissions.join(", ")}`,
                )
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        await command.execute(message, args, client);
    } catch (error) {
        console.error(`❌ Error running command "${commandName}":`, error);

        const errorEmbed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle("❌ Command Error")
            .setDescription("An error occurred while executing this command.")
            .setTimestamp();

        if (!message.replied && !message.deferred) {
            message.reply({ embeds: [errorEmbed] }).catch(console.error);
        }
    }
});

// Error handling
client.on("error", console.error);
process.on("unhandledRejection", console.error);

// Login
const token = process.env.DISCORD_TOKEN || "your_bot_token_here";
client.login(token).catch((err) => {
    console.error("Failed to login:", err);
    process.exit(1);
});
