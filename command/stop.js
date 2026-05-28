const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'stop',
  description: 'Stops playing music and leaves voice channel',
  async execute(message, args, client) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to be in active voice to stop playback!');
    }
    if (!serverQueue) {
      return message.reply('❌ I am not actively playing music anywhere in here!');
    }

    serverQueue.songs = []; // clear queue queue array
    serverQueue.player.stop();
    serverQueue.connection.destroy();
    client.queue.delete(message.guild.id);

    const stopEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setDescription('⏹️ Playback stopped, queue cleared and disconnected.');
    await message.reply({ embeds: [stopEmbed] });
  }
};