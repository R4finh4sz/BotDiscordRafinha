import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

export function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts'));

  for (const file of eventFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(`../events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`Evento ${event.name} carregado.`);
  }
}
