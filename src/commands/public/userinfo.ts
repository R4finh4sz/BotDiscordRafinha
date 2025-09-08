import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Exibe informações sobre um membro do servidor.')
    .addUserOption((option) =>
      option
        .setName('usuario')
        .setDescription(
          'O usuário sobre o qual você quer informações (opcional).',
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({
        content: 'Não consegui encontrar informações deste membro no servidor.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#1D86DA')
      .setTitle(`Informações de ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        { name: '👤 Tag do Usuário', value: `\`${user.tag}\``, inline: true },
        { name: '🆔 ID do Usuário', value: `\`${user.id}\``, inline: true },
        { name: '🤖 É um bot?', value: user.bot ? 'Sim' : 'Não', inline: true },
        {
          name: '🗓️ Conta Criada em',
          value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:f>`,
          inline: false,
        },
        {
          name: '📥 Entrou no Servidor em',
          value: member.joinedAt
            ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:f>`
            : 'Não disponível',
          inline: false,
        },
        {
          name: `🎭 Cargos (${member.roles.cache.size - 1})`,
          value:
            member.roles.cache
              .map((role) => role.name)
              .filter((name) => name !== '@everyone')
              .join(', ') || 'Nenhum cargo',
          inline: false,
        },
      )
      .setFooter({
        text: `Requisitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
