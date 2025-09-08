import { Client, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

export function loadCommands(client: Client) {
  const commands: unknown[] = [];
  const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, '..', 'commands', folder))
      .filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command = require(`../commands/${folder}/${file}`);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`Comando /${command.data.name} carregado.`);
      }
    }
  }

  const rest = new REST({ version: '10' }).setToken(config.token!);

  (async () => {
    try {
      console.log('Iniciando o registro dos slash commands (/).');
      await rest.put(Routes.applicationCommands(config.clientId!), {
        body: commands,
      });
      console.log('Slash commands (/) registrados com sucesso.');
    } catch (error) {
      console.error(error);
    }
  })();
}
