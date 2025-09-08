import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder(),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('quantidade', true);

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: 'Informe um valor entre 1 e 100.',
        ephemeral: true,
      });
    }

    if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
      return interaction.reply({
        content: 'Este comando só pode ser usado em canais de texto.',
        ephemeral: true,
      });
    }

    try {
      const deletedMessages = await interaction.channel.bulkDelete(
        amount,
        true,
      );
      await interaction.reply({
        content: `🧹 Foram apagadas ${deletedMessages.size} mensagens.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          'Ocorreu um erro. Não consigo apagar mensagens com mais de 14 dias ou não tenho permissão para isso neste canal.',
        ephemeral: true,
      });
    }
  },
};
