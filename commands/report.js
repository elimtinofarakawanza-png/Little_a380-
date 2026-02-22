const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to report')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the report')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const config = await GuildConfig.findOne({ guildId: interaction.guild.id });

        if (!config || !config.reportChannel) {
            return interaction.reply({
                content: 'No report channel set. Use `/setreportchannel` first.',
                ephemeral: true
            });
        }

        const reportChannel = interaction.guild.channels.cache.get(config.reportChannel);
        if (!reportChannel) {
            return interaction.reply({
                content: 'The saved report channel no longer exists. Please set a new one.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('New Report')
            .addFields(
                { name: 'Reported User', value: `${user.tag}` },
                { name: 'Reason', value: reason },
                { name: 'Reported By', value: `${interaction.user.tag}` }
            )
            .setColor('Red')
            .setTimestamp();

        await reportChannel.send({ embeds: [embed] });

        await interaction.reply({
            content: 'Your report has been submitted.',
            ephemeral: true
        });
    }
};
