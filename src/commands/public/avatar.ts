import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Mostra o avatar de um usuário.')
    .addUserOption((option) =>
      option.setName('usuario').setDescription('Usuário para ver o avatar.'),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    await interaction.reply(
      user.displayAvatarURL({ size: 1024, extension: 'png' }),
    );
  },
};
