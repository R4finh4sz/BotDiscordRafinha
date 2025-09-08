import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Exibe informações detalhadas sobre o servidor.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const { guild } = interaction;

    if (!guild) {
      return interaction.reply({
        content: 'Este comando só pode ser usado em um servidor.',
        ephemeral: true,
      });
    }

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`Informações do Servidor: ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .addFields(
        { name: '👑 Dono do Servidor', value: owner.user.tag, inline: true },
        { name: '🆔 ID do Servidor', value: `\`${guild.id}\``, inline: true },
        {
          name: '🗓️ Criado em',
          value: `<t:${Math.floor(guild.createdAt.getTime() / 1000)}:D>`,
          inline: true,
        },
        { name: '👥 Membros', value: `${guild.memberCount}`, inline: true },
        {
          name: '💬 Canais',
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        { name: '🎭 Cargos', value: `${guild.roles.cache.size}`, inline: true },
      )
      .setFooter({
        text: `Requisitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
