const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;

const ALLOWED_ROLES = ['1462341126169296916'];
const TIMEOUT_DURATION = 10 * 60 * 1000;
const linkRegex = /(https?:\/\/[^\s]+)/i;

client.on('messageCreate', async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!linkRegex.test(message.content)) return;

  const member = await message.guild.members.fetch(message.author.id);

  const allowed = member.roles.cache.some(role =>
    ALLOWED_ROLES.includes(role.id)
  );

  if (allowed) return;

  await message.delete().catch(() => {});
  await member.timeout(TIMEOUT_DURATION, 'Link violation').catch(() => {});
});

client.login(TOKEN);
