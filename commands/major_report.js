const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('major_report')
        .setDescription('Report a user for a serious violation (TOS, doxxing, NSFW, threats, etc.)')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to report')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Describe the serious violation (required)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const staffRole = '1473617514771775518';
        const majorReportChannel = '1473615876136767543';

        // Permission check
        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (!reason || reason.trim().length === 0) {
            return interaction.reply({
                content: '❌ You must provide a valid reason for a major report.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🚨 MAJOR REPORT — Serious Violation')
            .setDescription('A serious incident has been reported.')
            .addFields(
                { name: 'Reported User', value: `${target}`, inline: true },
                { name: 'Reported By', value: `${interaction.user}`, inline: true },
                { name: 'Violation Details', value: reason }
            )
            .setColor('#ff0000')
            .setTimestamp();

        // Acknowledge to the staff member
        await interaction.reply({
            content: '⚠️ Major report submitted. Staff will review this immediately.',
            ephemeral: true
        });

        // Send to the major report channel
        const channel = interaction.guild.channels.cache.get(majorReportChannel);

        if (channel) {
            channel.send({ embeds: [embed] });
        } else {
            console.error(`Major report channel ${majorReportChannel} not found.`);
        }
    }
};
