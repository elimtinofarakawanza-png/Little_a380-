const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "report",
    description: "Report a user",
    options: [
        {
            name: "user",
            description: "The user you want to report",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Reason for the report",
            type: 3,
            required: true
        }
    ],

    async execute(interaction) {
        const reportedUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const configPath = path.join(__dirname, "../data/reportConfig.json");
        const reportsPath = path.join(__dirname, "../data/reports.json");

        const config = JSON.parse(fs.readFileSync(configPath));
        const reports = JSON.parse(fs.readFileSync(reportsPath));

        const reportId = reports.length + 1;

        const newReport = {
            id: reportId,
            reporter: interaction.user.id,
            reported: reportedUser.id,
            reason: reason,
            type: "normal",
            timestamp: Date.now()
        };

        reports.push(newReport);
        fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

        const embed = new EmbedBuilder()
            .setTitle(`Report #${reportId}`)
            .addFields(
                { name: "Report by", value: `<@${interaction.user.id}>` },
                { name: "Reported User", value: `<@${reportedUser.id}>` },
                { name: "Reason", value: reason }
            )
            .setColor("Yellow")
            .setTimestamp();

        const channel = interaction.client.channels.cache.get(config.reportChannel);
        if (channel) channel.send({ embeds: [embed] });

        await interaction.reply({ content: "Report submitted.", ephemeral: true });
    }
};
