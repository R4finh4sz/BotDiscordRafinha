import { Events, Client } from 'discord.js';

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (client.user) {
      console.log(`Bot online! Logado como ${client.user.tag}`);
    }
  },
};
