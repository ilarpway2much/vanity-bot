const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.GuildMember, Partials.User],
});

const GUILD_ID = '1505237937586180256';
const ROLE_ID = '1539036487792992307';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.Raw, async (packet) => {
  if (packet.t !== 'GUILD_MEMBER_UPDATE') return;
  const data = packet.d;
  if (data.guild_id !== GUILD_ID) return;

  const tagInfo = data.user?.primary_guild;
  const hasTag = tagInfo?.identity_enabled === true && tagInfo?.identity_guild_id === GUILD_ID;

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(data.user.id);
    const hasRole = member.roles.cache.has(ROLE_ID);

    if (hasTag && !hasRole) {
      await member.roles.add(ROLE_ID);
      console.log(`Added role to ${member.user.tag}`);
    } else if (!hasTag && hasRole) {
      await member.roles.remove(ROLE_ID);
      console.log(`Removed role from ${member.user.tag}`);
    }
  } catch (err) {
    console.error('Role update failed:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
