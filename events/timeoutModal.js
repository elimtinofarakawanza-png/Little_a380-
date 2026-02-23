module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        const [modalId, userId] = interaction.customId.split("_");
        if (modalId !== "timeoutModal") return;

        const member = interaction.guild.members.cache.get(userId);
        if (!member) {
            return interaction.reply({ content: "❌ User not found.", ephemeral: true });
        }

        const durationInput = interaction.fields.getTextInputValue("duration");
        const reason = interaction.fields.getTextInputValue("reason");

        const match = durationInput.match(/^(\d+)(s|m|h|d)$/);

        if (!match) {
            return interaction.reply({
                content: "❌ Invalid duration format. Use formats like `10m`, `2h`, `1d`.",
                ephemeral: true
            });
        }

        const value = parseInt(match[1]);
        const unit = match[2];

        let ms = 0;
        if (unit === "s") ms = value * 1000;
        if (unit === "m") ms = value * 60 * 1000;
        if (unit === "h") ms = value * 60 * 60 * 1000;
        if (unit === "d") ms = value * 24 * 60 * 60 * 1000;

        await member.timeout(ms, reason).catch(() => {});

        return interaction.reply({
            content: `⏳ <@${userId}> has been timed out for **${durationInput}**.\nReason: ${reason}`,
            ephemeral: true
        });
    }
};
