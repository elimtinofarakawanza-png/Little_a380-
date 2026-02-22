const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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

        // Check if user has the required role
        if (!interaction.member.roles.cache.has(allowedRole)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // Safety check (should never happen because reason is required)
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

        await interaction.reply({
            content: '✅ Report submitted successfully.',
            ephemeral: true
        });

        // Send the report to a staff channel (optional)
        const logChannel = interaction.guild.channels.cache.find(
            ch => ch.name === 'reports' // change if needed
        );

        if (logChannel) {
            logChannel.send({ embeds: [embed] });
        }
    }
};
