import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `Pong! A latência da API é de ${Math.round(interaction.client.ws.ping)}ms.`,
    );
  },
};
