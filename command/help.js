const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'help',
  description: 'Displays a lists of all available music commands',
  async execute(message, args, client) {
    const helpEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🎵 24/7 Discord Music Bot Commands')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('Here are all the parameters and controls supported by ' + client.user.username + '. Use prefix **' + config.prefix + '** before commands!')
      .addFields(
        { name: '🎤 Play', value: '```' + config.prefix + 'play <song name/link>```\nStream tracks from YouTube, Soundcloud or Spotify.', inline: false },
        { name: '⏭️ Skip', value: '```' + config.prefix + 'skip```\nSkip the current song playing.', inline: true },
        { name: '⏹️ Stop', value: '```' + config.prefix + 'stop```\nStop streaming music, clear the queue, and disconnect.', inline: true },
        { name: '📊 Queue', value: '```' + config.prefix + 'queue```\nCheck what songs are currently queued up and waiting.', inline: true },
        { name: '⏸️ Pause', value: '```' + config.prefix + 'pause``` / ```' + config.prefix + 'resume```\nPause active streams and resume.', inline: false }
      )
      .setFooter({ text: 'Railway 24/7 Music Core Pro' })
      .setTimestamp();

    await message.reply({ embeds: [helpEmbed] });
  }
};