const fs = require('fs');
const path = require('path');

module.exports = {
    name: "setreportchannel",
    description: "Set the channel where reports will be sent",
    options: [
        {
            name: "channel",
            description: "The channel to send reports to",
            type: 7, // CHANNEL
            required: true
        }
    ],

    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");

        const configPath = path.join(__dirname, "../data/reportConfig.json");
        const config = { reportChannel: channel.id };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        await interaction.reply(`Report channel set to ${channel}`);
    }
};
