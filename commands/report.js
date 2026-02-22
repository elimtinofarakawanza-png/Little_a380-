const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user for a specific reason.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to report')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the report (required)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedRole = '1473617514771775518';
        const reportChannelId = '1473615876136767543';

        // Check if user has the required role
        if (!interaction.member.roles.cache.has(allowedRole)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (!reason || reason.trim().length === 0) {
            return interaction.reply({
                content: '❌ You must provide a valid reason.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🚨 New Report Submitted')
            .addFields(
                { name: 'Reported User', value: `${target}`, inline: true },
                { name: 'Reported By', value: `${interaction.user}`, inline: true },
                { name: 'Reason', value: reason }
            )
            .setColor('#ff0000')
            .setTimestamp();

        // Acknowledge to the reporter
        await interaction.reply({
            content: '✅ Report submitted successfully.',
            ephemeral: true
        });

        // Send to the specific channel
        const logChannel = interaction.guild.channels.cache.get(reportChannelId);

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        } else {
            console.error(`Report channel ${reportChannelId} not found.`);
        }
    }
};
