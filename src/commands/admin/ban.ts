import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bane um membro do servidor.')
    .addUserOption((option) =>
      option
        .setName('usuario')
        .setDescription('O usuário a ser banido.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('motivo').setDescription('O motivo do banimento.'),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      return interaction.reply({
        content: 'Este comando só pode ser usado em um servidor.',
        ephemeral: true,
      });
    }

    const userToBan = interaction.options.getUser('usuario', true);
    const member = await interaction.guild.members
      .fetch(userToBan.id)
      .catch(() => null);
    const reason =
      interaction.options.getString('motivo') || 'Nenhum motivo fornecido.';

    if (userToBan.id === interaction.user.id) {
      return interaction.reply({
        content: 'Você não pode se banir.',
        ephemeral: true,
      });
    }

    if (userToBan.id === interaction.client.user.id) {
      return interaction.reply({
        content: 'Eu não posso me banir.',
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply({
        content: 'Usuário não encontrado no servidor.',
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content:
          'Não consigo banir este usuário. Ele pode ter um cargo maior que o meu ou eu não tenho permissão.',
        ephemeral: true,
      });
    }

    try {
      await userToBan.send(
        `Você foi banido do servidor **${interaction.guild.name}**. Motivo: ${reason}`,
      );
    } catch (dmError) {
      console.log(`Não foi possível enviar DM para ${userToBan.tag}.`);
    }

    try {
      await member.ban({ reason });
      await interaction.reply({
        content: `⛔ ${userToBan.tag} foi banido com sucesso. Motivo: ${reason}`,
      });
    } catch (banError) {
      console.error(banError);
      await interaction.reply({
        content: 'Ocorreu um erro ao tentar banir o membro.',
        ephemeral: true,
      });
    }
  },
};
