const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

const eightball = {
    name: "8ball",
    description: "Ask the magic 8-ball a question",
    usage: "!8ball <question>",
    async execute(message, args, client) {
        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription("Usage: `!8ball <question>`")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const responses = [
            "It is certain",
            "It is decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy, try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
        ];

        const question = args.join(" ");
        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("🎱 Magic 8-Ball")
            .addFields(
                { name: "Question", value: question, inline: false },
                { name: "Answer", value: response, inline: false }
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

const joke = {
    name: "joke",
    description: "Get a random joke",
    usage: "!joke",
    async execute(message, args, client) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!",
            "What do you call a fake noodle? An impasta!",
            "Why did the math book look so sad? Because it was full of problems!",
            "What do you call a bear with no teeth? A gummy bear!",
            "Why can't a bicycle stand up by itself? It's two tired!",
            "What do you call a sleeping bull? A bulldozer!",
            "Why did the cookie go to the doctor? Because it felt crumbly!",
            "What do you call a fish wearing a bowtie? Sofishticated!",
            "Why don't skeletons fight each other? They don't have the guts!",
            "What do you call a cow with no legs? Ground beef!",
            "Why did the banana go to the doctor? It wasn't peeling well!",
            "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
            "Why don't programmers like nature? It has too many bugs!"
        ];

        const joke = jokes[Math.floor(Math.random() * jokes.length)];

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle("😂 Random Joke")
            .setDescription(joke)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

const coinflip = {
    name: "coinflip",
    description: "Flip a coin",
    usage: "!coinflip",
    async execute(message, args, client) {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        const emoji = result === "Heads" ? "🪙" : "🥇";

        const embed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle(`${emoji} Coin Flip`)
            .setDescription(`The coin landed on **${result}**!`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

const roll = {
    name: "roll",
    description: "Roll a dice",
    usage: "!roll [sides] (default: 6)",
    async execute(message, args, client) {
        let sides = 6;
        
        if (args.length > 0) {
            const inputSides = parseInt(args[0]);
            if (isNaN(inputSides) || inputSides < 2) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle("❌ Invalid Input")
                    .setDescription("Please provide a valid number of sides (minimum 2).")
                    .setTimestamp();
                return message.reply({ embeds: [embed] });
            }
            sides = inputSides;
        }

        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle("🎲 Dice Roll")
            .setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

const rps = {
    name: "rps",
    description: "Play Rock Paper Scissors with the bot",
    usage: "!rps <rock|paper|scissors>",
    async execute(message, args, client) {
        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Usage")
                .setDescription("Usage: `!rps <rock|paper|scissors>`")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const choices = ["rock", "paper", "scissors"];
        const userChoice = args[0].toLowerCase();

        if (!choices.includes(userChoice)) {
            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle("❌ Invalid Choice")
                .setDescription("Please choose rock, paper, or scissors.")
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result;
        let color;
        if (userChoice === botChoice) {
            result = "It's a tie!";
            color = config.colors.warning;
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = "You win!";
            color = config.colors.success;
        } else {
            result = "I win!";
            color = config.colors.error;
        }

        const emojis = {
            rock: "🪨",
            paper: "📄",
            scissors: "✂️"
        };

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("🎮 Rock Paper Scissors")
            .addFields(
                { name: "Your Choice", value: `${emojis[userChoice]} ${userChoice}`, inline: true },
                { name: "My Choice", value: `${emojis[botChoice]} ${botChoice}`, inline: true },
                { name: "Result", value: result, inline: true }
            )
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};

module.exports = {
    "8ball": eightball,
    joke,
    coinflip,
    roll,
    rps
};
