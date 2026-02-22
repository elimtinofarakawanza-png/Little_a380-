const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  reportChannel: { type: String, default: null }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
