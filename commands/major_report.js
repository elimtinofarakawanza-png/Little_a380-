const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "major_report",
    description: "Report a user for a serious violation",
    options: [
        {
            name: "user",
            description: "The user you want to report",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Describe the serious violation",
            type: 3,
            required: true
        }
    ],

    async execute(interaction) {
        const staffRole = '1473617514771775518'; // Staff only
        const majorReportChannel = '1473615876136767543';

        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: '❌ You do not have permission to use this command.',
                ephemeral: true
            });
        }

        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const reportsPath = path.join(__dirname, "../data/reports.json");
        const reports = JSON.parse(fs.readFileSync(reportsPath));

        const reportId = reports.length + 1;

        const newReport = {
            id: reportId,
            reporter: interaction.user.id,
            reported: target.id,
            reason: reason,
            type: "major",
            timestamp: Date.now()
        };

        reports.push(newReport);
        fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

        // Count total reports
        const userReports = reports.filter(r => r.reported === target.id);

        // Auto-quarantine
        if (userReports.length >= 5) {
            const quarantineRole = "1475451309128945704"; // FIXED
            const alertChannelId = "1473615876136767543";

            const member = interaction.guild.members.cache.get(target.id);
            if (member) {
                await member.roles.add(quarantineRole).catch(() => {});
            }

            const alertChannel = interaction.guild.channels.cache.get(alertChannelId);
            if (alertChannel) {
                const alertEmbed = new EmbedBuilder()
                    .setTitle("🚨 User Quarantined Automatically")
                    .setDescription(`<@${target.id}> has reached **5 reports** and has been placed in quarantine.`)
                    .addFields(
                        { name: "Total Reports", value: `${userReports.length}` },
                        { name: "Most Recent Reason", value: reason }
                    )
                    .setColor("Red")
                    .setTimestamp();

                alertChannel.send({
                    content: `<@&1475451309128945704>`, // FIXED
                    embeds: [alertEmbed]
                });
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('🚨 MAJOR REPORT — Serious Violation')
            .addFields(
                { name: 'Reported User', value: `<@${target.id}>`, inline: true },
                { name: 'Reported By', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Violation Details', value: reason }
            )
            .setColor("Red")
            .setTimestamp();

        await interaction.reply({
            content: '⚠️ Major report submitted.',
            ephemeral: true
        });

        const channel = interaction.guild.channels.cache.get(majorReportChannel);
        if (channel) channel.send({ embeds: [embed] });
    }
};
