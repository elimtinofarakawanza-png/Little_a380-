const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isButton()) return;

        const staffRole = "1473617514771775518";
        const higherRole = "1473617333791621314";

        const [action, userId] = interaction.customId.split("_");
        const member = interaction.guild.members.cache.get(userId);

        if (!member) {
            return interaction.reply({ content: "❌ User not found.", ephemeral: true });
        }

        // Permission check for all actions
        if (!interaction.member.roles.cache.has(staffRole)) {
            return interaction.reply({
                content: `❌ You must be <@&${staffRole}> or higher to use this panel.`,
                ephemeral: true
            });
        }

        // Timeout → open modal
        if (action === "timeout") {
            const modal = new ModalBuilder()
                .setCustomId(`timeoutModal_${userId}`)
                .setTitle("Timeout User");

            const durationInput = new TextInputBuilder()
                .setCustomId("duration")
                .setLabel("Duration (e.g., 10m, 2h, 1d)")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const reasonInput = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Reason for timeout")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(durationInput),
                new ActionRowBuilder().addComponents(reasonInput)
            );

            return interaction.showModal(modal);
        }

        // Kick
        if (action === "kick") {
            await member.kick().catch(() => {});
            return interaction.reply({ content: `👢 <@${userId}> has been kicked.`, ephemeral: true });
        }

        // Ban
        if (action === "ban") {
            await member.ban().catch(() => {});
            return interaction.reply({ content: `🔨 <@${userId}> has been banned.`, ephemeral: true });
        }

        // Quarantine
        if (action === "quarantine") {
            const quarantineRole = "1475451309128945704";
            await member.roles.add(quarantineRole).catch(() => {});
            return interaction.reply({ content: `🚨 <@${userId}> has been quarantined.`, ephemeral: true });
        }

        // Pardon
        if (action === "pardon") {
            const quarantineRole = "1475451309128945704";
            await member.roles.remove(quarantineRole).catch(() => {});
            return interaction.reply({ content: `✅ <@${userId}> has been pardoned.`, ephemeral: true });
        }

        // Remove Role (requires higher role)
        if (action === "removerole") {
            if (!interaction.member.roles.cache.has(higherRole)) {
                return interaction.reply({
                    content: `❌ Sorry, you need to be <@&${higherRole}> to access this action.`,
                    ephemeral: true
                });
            }

            const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id);

            if (roles.size === 0) {
                return interaction.reply({ content: "❌ User has no removable roles.", ephemeral: true });
            }

            const role = roles.first();
            await member.roles.remove(role.id).catch(() => {});

            return interaction.reply({
                content: `🗑️ Removed role **${role.name}** from <@${userId}>.`,
                ephemeral: true
            });
        }

        // Clear Reports
        if (action === "clearreports") {
            const reportsPath = path.join(__dirname, "../data/reports.json");
            let reports = JSON.parse(fs.readFileSync(reportsPath));

            reports = reports.filter(r => r.reported !== userId);
            fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));

            return interaction.reply({
                content: `🧹 Cleared all reports for <@${userId}>.`,
                ephemeral: true
            });
        }
    }
};
