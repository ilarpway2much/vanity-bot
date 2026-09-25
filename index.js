const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.GuildMember],
});

const GUILD_ID = '1505237937586180256';
const ROLE_ID = '1539036487792992307';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (newMember.guild.id !== GUILD_ID) return;

  const tagInfo = newMember.user.primaryGuild;
  const hasTag = tagInfo?.identityEnabled && tagInfo?.identityGuildId === GUILD_ID;

  const hasRole = newMember.roles.cache.has(ROLE_ID);

  try {
    if (hasTag && !hasRole) {
      await newMember.roles.add(ROLE_ID);
      console.log(`Added role to ${newMember.user.tag}`);
    } else if (!hasTag && hasRole) {
      await newMember.roles.remove(ROLE_ID);
      console.log(`Removed role from ${newMember.user.tag}`);
    }
  } catch (err) {
    console.error('Role update failed:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
