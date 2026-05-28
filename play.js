const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const config = require('../config');

module.exports = {
  name: 'play',
  description: 'Search and stream music in a voice channel',
  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('❌ You need to join a voice channel first to play music!');
    }

    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.reply('❌ I do not have permission to join/speak in your voice channel!');
    }

    const query = args.join(' ');
    if (!query) {
      return message.reply('❌ Please provide a song name or video URL! \nUsage: **' + config.prefix + 'play <song>**');
    }

    await message.channel.sendTyping();

    // Get or Create Queue
    let serverQueue = client.queue.get(message.guild.id);

    try {
      let songInfo = null;
      let url = query;

      // Search using play-dl (supports YT search or URL)
      if (!play.yt_validate(query)) {
        const searchResults = await play.search(query, { limit: 1 });
        if (searchResults.length === 0) {
          return message.reply('❌ No results found on YouTube matching your query.');
        }
        songInfo = searchResults[0];
        url = songInfo.url;
      } else {
        const info = await play.video_info(query);
        songInfo = info.video_details;
      }

      const song = {
        title: songInfo.title,
        url: url,
        duration: songInfo.durationRaw || '4:15',
        thumbnail: songInfo.thumbnails?.[0]?.url || songInfo.thumbnail?.url || ''
      };

      if (!serverQueue) {
        const queueConstruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          player: null,
          playing: true,
        };

        client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        // Join Voice and establish Player
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
        });

        queueConstruct.connection = connection;
        queueConstruct.player = createAudioPlayer();
        
        connection.subscribe(queueConstruct.player);

        playSong(message.guild.id, queueConstruct.songs[0], client);
      } else {
        serverQueue.songs.push(song);
        const addEmbed = new EmbedBuilder()
          .setColor(config.embedColor)
          .setTitle('✅ Song Added to Queue')
          .setDescription(`[**${song.title}**](${song.url}) has been added to queue!`)
          .setThumbnail(song.thumbnail)
          .addFields({ name: 'Duration', value: song.duration, inline: true })
          .setTimestamp();
        return message.reply({ embeds: [addEmbed] });
      }

    } catch (error) {
      console.error(error);
      message.reply('❌ Encountered an error looking up or loading that stream player.');
    }
  }
};

async function playSong(guildId, song, client) {
  const serverQueue = client.queue.get(guildId);
  if (!song) {
    // Queue ended - leave after 60s of inactivity
    setTimeout(() => {
      const activeQueue = client.queue.get(guildId);
      if (!activeQueue || activeQueue.songs.length === 0) {
        serverQueue.connection.destroy();
        client.queue.delete(guildId);
      }
    }, 60000);
    return;
  }

  try {
    // Stream stream with play-dl
    const stream = await play.stream(song.url, {
      quality: 1 // Highest audio
    });

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    serverQueue.player.play(resource);

    const playEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(' Now Playing')
      .setDescription('✨ [**' + song.title + '**](' + song.url + ')')
      .setThumbnail(song.thumbnail)
      .addFields(
        { name: '🎵 Duration', value: '```' + song.duration + '```', inline: true },
        { name: '🔊 Queue Position', value: '```#1 Active```', inline: true }
      )
      .setTimestamp();

    serverQueue.textChannel.send({ embeds: [playEmbed] });

    serverQueue.player.once(AudioPlayerStatus.Idle, () => {
      serverQueue.songs.shift();
      playSong(guildId, serverQueue.songs[0], client);
    });

  } catch (err) {
    console.error(err);
    serverQueue.textChannel.send('❌ Failed to play stream resource properly.');
  }
                                     }
