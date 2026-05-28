require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID, // Optional: for fast testing in a specific guild
  prefix: process.env.PREFIX || "!",
  embedColor: process.env.EMBED_COLOR || "#4f46e5",
  
  // Audio sources configuration
  lyricsEnabled: false,

  // Basic audio search configurations
  youtubeCookie: process.env.YOUTUBE_COOKIE || ''
};