const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'queue',
  description: 'Displays the current active song queue',
  async execute(message, args, client) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) {
      return message.reply('❌ There is no active playlist queue right now!');
    }

    const currentSong = serverQueue.songs[0];
    let description = '📊 **Currently Playing**\n[**' + currentSong.title + '**](' + currentSong.url + ') (' + currentSong.duration + ')\n\n**Upcoming Queue**\n';

    if (serverQueue.songs.length === 1) {
      description += 'No other songs are lined up in queue!';
    } else {
      for (let i = 1; i < Math.min(serverQueue.songs.length, 10); i++) {
        description += i + '. [' + serverQueue.songs[i].title + '](' + serverQueue.songs[i].url + ') - (' + serverQueue.songs[i].duration + ')\n';
      }
      if (serverQueue.songs.length > 10) {
        description += '\n*Plus ' + (serverQueue.songs.length - 10) + ' more songs...*';
      }
    }

    const queueEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🎵 Dynamic Server Playlist Queue')
      .setDescription(description)
      .setTimestamp();

    await message.reply({ embeds: [queueEmbed] });
  }
};