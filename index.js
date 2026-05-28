/**
 * Discord Music Bot Entry Point
 * Created for 24/7 hosting on Railway
 */

const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Initialize Discord Client with necessary Gateway Intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Collection to hold commands
client.commands = new Collection();
client.queue = new Map(); // Global music queue (Guild ID -> Queue Object)

// Command Loader
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.name) {
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  }
}

// Bot Startup Handlers
client.once('ready', () => {
  console.log(`[SUCCESS] logged in as ${client.user.tag}!`);
  console.log(`[READY] Bot is operational and ready to play music in Discord!`);
  
  // Set elegant presence
  client.user.setActivity({
    name: `music | ${config.prefix}help`,
    type: 2 // Listening
  });
});

// Command dispatcher
client.on('messageCreate', async (message) => {
  // Ignore bots and webhooks
  if (message.author.bot || !message.guild) return;

  // Basic command parsing
  const prefix = config.prefix;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(`[ERROR] executing command ${commandName}:`, error);
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ Command Error')
      .setDescription('There was an error trying to execute that command! Please verify ffmpeg support.')
      .setTimestamp();
    message.reply({ embeds: [errorEmbed] }).catch(() => {});
  }
});

// Login Bot securely
if (!config.token) {
  console.error('[CRITICAL] DISCORD_TOKEN is missing in environment! Please configure this on Railway.');
  process.exit(1);
}

client.login(config.token);
