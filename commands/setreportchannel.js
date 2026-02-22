const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreportchannel')
        .setDescription('Set the report channel for this server')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where reports will be sent')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
        if (!config) {
            config = new GuildConfig({ guildId: interaction.guild.id });
        }

        config.reportChannel = channel.id;
        await config.save();

        await interaction.reply({
            content: `Report channel set to ${channel}`,
            ephemeral: true
        });
    }
};
