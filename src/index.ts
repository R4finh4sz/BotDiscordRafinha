import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { loadCommands } from './utils/commandHandler';
import { loadEvents } from './utils/eventHandler';
import { Command } from './types/Command';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

client.commands = new Collection<string, Command>();

async function start() {
  if (!config.token) {
    console.error(
      'ERRO: Token do Discord não encontrado. Verifique seu arquivo .env',
    );
    return;
  }

  try {
    console.log('Carregando comandos e eventos...');

    loadCommands(client);
    loadEvents(client);

    await client.login(config.token);
  } catch (error) {
    console.error('Não foi possível iniciar o bot:', error);
  }
}

start();
