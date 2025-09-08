import { Events, Interaction } from 'discord.js';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erro ao executar o comando ${interaction.commandName}`);
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Ocorreu um erro ao executar este comando!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'Ocorreu um erro ao executar este comando!',
          ephemeral: true,
        });
      }
    }
  },
};
