import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  GuildMember,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa um membro do servidor.')
    .addUserOption((option) =>
      option
        .setName('usuario')
        .setDescription('O usuário a ser expulso.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('motivo').setDescription('O motivo da expulsão.'),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: 'Este comando só pode ser usado em um servidor.',
        ephemeral: true,
      });
    }

    const member = interaction.options.getMember(
      'usuario',
    ) as GuildMember | null;
    const reason =
      interaction.options.getString('motivo') || 'Nenhum motivo fornecido.';

    if (!member) {
      return interaction.reply({
        content: 'Usuário não encontrado.',
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: 'Não tenho permissão para expulsar este usuário.',
        ephemeral: true,
      });
    }

    try {
      await member.kick(reason);
      await interaction.reply({
        content: `O usuário ${member.user.tag} foi expulso. Motivo: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Ocorreu um erro ao tentar expulsar o membro.',
        ephemeral: true,
      });
    }
  },
};
