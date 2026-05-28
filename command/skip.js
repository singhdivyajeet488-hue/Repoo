const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'skip',
  description: 'Skips the current song in progress',
  async execute(message, args, client) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to join voice to skip tracks!');
    }
    if (!serverQueue) {
      return message.reply('❌ There is no active song playing to skip!');
    }
    
    // Stop matches playing, triggers Idle event to play next
    serverQueue.player.stop();
    
    const skipEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setDescription('⏩ Skipped the current track successfully.');
    await message.reply({ embeds: [skipEmbed] });
  }
};