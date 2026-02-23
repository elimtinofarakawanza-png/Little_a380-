const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "help",
    description: "Shows all commands, TOS, and Privacy Policy",

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("📘 Help Menu")
            .setDescription("Below is a list of available commands and important server policies.")
            .addFields(
                {
                    name: "🛠️ Commands",
                    value:
                    "**/report** – Report a user\n" +
                    "**/major_report** – File a serious violation report\n" +
                    "**/setreportchannel** – Set the report log channel\n" +
                    "**/info** – Shows bot information\n" +
                    "**/help** – Shows this help menu"
                },
                {
                    name: "📜 Terms of Service (TOS)",
                    value:
                    "• All members are expected to conduct themselves respectfully and responsibly at all times.\n" +
                    "• Harassment, discrimination, hate speech, or targeted abuse of any kind is strictly prohibited.\n" +
                    "• Misuse of bot commands, including spam or false reporting, is not permitted.\n" +
                    "• Users must comply with Discord’s Community Guidelines and Terms of Service.\n" +
                    "• Staff reserve the right to take appropriate action—including warnings, quarantines, or removal—based on server behaviour.\n" +
                    "• Continued participation in the server constitutes acceptance of these terms."
                },
                {
                    name: "🔒 Privacy Policy",
                    value:
                    "• The bot collects and stores report information solely for moderation and safety purposes.\n" +
                    "• Stored data includes: reporter ID, reported user ID, reason for the report, and timestamp.\n" +
                    "• No personal information beyond Discord user IDs is collected or processed.\n" +
                    "• Report data is not shared with third parties and is accessible only to authorized staff members.\n" +
                    "• Data is retained only as long as necessary for moderation operations and may be removed upon staff review.\n" +
                    "• By using the bot, users acknowledge and consent to this limited data handling for safety and enforcement purposes."
                }
            )
            .setColor("Blue")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
