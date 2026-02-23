const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "info",
    description: "Shows information about the bot",

    async execute(interaction) {
        const bot = interaction.client;

        const embed = new EmbedBuilder()
            .setTitle('Little A380 — Bot Information')
            .setDescription('This bot is still a work in progress, but here’s what it can do so far.')
            .addFields(
                { name: 'Status', value: '🟢 Online', inline: true },
                { name: 'Servers', value: `${bot.guilds.cache.size}`, inline: true },
                { name: 'Users', value: `${bot.users.cache.size}`, inline: true },
                { name: 'Developer', value: 'Elim', inline: true },
                { name: 'Version', value: '1.0.0 (WIP)', inline: true }
            )
            .setColor('#00AEEF')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
