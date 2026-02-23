const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "admin_panel",
    description: "Opens the administrative panel for a specific user",
    options: [
        {
            name: "user",
            description: "The user you want to manage",
            type: 6,
            required: true
        }
    ],

    async execute(interaction) {
        const staffRole = "1473617514771775518";
        const target = interaction.options.getUser("user");

        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: `❌ Sorry, but it seems you are trying to access a restricted command.\nYou must be <@&${staffRole}> or higher to use this command.`,
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🛠️ Administrative Control Panel")
            .setDescription(`Managing user: <@${target.id}>`)
            .setColor("Purple")
            .setTimestamp();

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`timeout_${target.id}`).setLabel("Timeout").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`kick_${target.id}`).setLabel("Kick").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(`ban_${target.id}`).setLabel("Ban").setStyle(ButtonStyle.Danger)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`quarantine_${target.id}`).setLabel("Quarantine").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`pardon_${target.id}`).setLabel("Pardon").setStyle(ButtonStyle.Success)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`removerole_${target.id}`).setLabel("Remove Role").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId(`clearreports_${target.id}`).setLabel("Clear Reports").setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3],
            ephemeral: true
        });
    }
};
