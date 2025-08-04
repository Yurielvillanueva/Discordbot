const { EmbedBuilder } = require("discord.js");

const animeList = [
    { title: "Attack on Titan", genre: "action, drama, supernatural", comment: "A dark, intense story with epic battles." },
    { title: "Your Name", genre: "romance, drama, supernatural", comment: "A beautiful, emotional story with stunning animation." },
    { title: "Jujutsu Kaisen", genre: "action, supernatural", comment: "Modern shonen with insane fight scenes." },
    { title: "Toradora!", genre: "romance, comedy, slice of life", comment: "High school romance with heart and laughs." },
    { title: "Clannad: After Story", genre: "romance, drama", comment: "Prepare your tears for this emotional masterpiece." },
    { title: "Steins;Gate", genre: "sci-fi, thriller", comment: "Time travel done right — thrilling and smart." },
    { title: "Death Note", genre: "thriller, psychological, supernatural", comment: "A cat-and-mouse game between geniuses." },
    { title: "Blue Lock", genre: "sports, psychological", comment: "Soccer becomes a fierce battle of ego." },
    { title: "Mob Psycho 100", genre: "action, comedy, supernatural", comment: "Psychic powers and personal growth collide." },
    { title: "Horimiya", genre: "romance, slice of life", comment: "Wholesome high school love with realistic vibes." },
    { title: "Demon Slayer", genre: "action, supernatural", comment: "Beautifully animated battles and family bonds." },
    { title: "Made in Abyss", genre: "adventure, fantasy, dark", comment: "Cute visuals, terrifying depth." },
    { title: "Kaguya-sama: Love is War", genre: "romance, comedy, psychological", comment: "Love is a battlefield — and hilarious!" },
    { title: "Oshi no Ko", genre: "drama, mystery, psychological", comment: "Idol life gets dark, fast." },
    { title: "Spy x Family", genre: "action, comedy, slice of life", comment: "Secret agents and wholesome chaos." }
];

module.exports = {
    name: "anime",
    description: "Get a random anime recommendation, optionally filtered by genre",
    usage: "!anime [genre]",
    async execute(message, args, client) {
        const inputGenre = args.join(" ").toLowerCase();
        let filteredAnime = animeList;

        if (inputGenre) {
            filteredAnime = animeList.filter(a => a.genre.includes(inputGenre));
        }

        if (filteredAnime.length === 0) {
            return message.channel.send(`❌ No anime found for genre: **${inputGenre}**.`);
        }

        const anime = filteredAnime[Math.floor(Math.random() * filteredAnime.length)];

        const embed = new EmbedBuilder()
            .setTitle(`🎌 Anime Recommendation: ${anime.title}`)
            .addFields(
                { name: "📚 Genre", value: anime.genre },
                { name: "💬 Comment", value: anime.comment }
            )
            .setColor("Random")
            .setFooter({ text: "Use !anime [genre] for another suggestion!" });

        message.channel.send({ embeds: [embed] });
    }
};
