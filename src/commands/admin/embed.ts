import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ColorResolvable,
} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Cria e envia uma mensagem embed customizada.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName('descricao')
        .setDescription('O texto principal do embed.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('titulo').setDescription('O título do embed.'),
    )
    .addStringOption((option) =>
      option
        .setName('cor')
        .setDescription(
          'A cor da barra lateral do embed (formato HEX, ex: #FF0000).',
        ),
    )
    .addStringOption((option) =>
      option.setName('footer').setDescription('O texto do rodapé do embed.'),
    )
    .addStringOption((option) =>
      option
        .setName('imagem')
        .setDescription('URL da imagem principal do embed.'),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('titulo');
    const description = interaction.options.getString('descricao', true);
    const color = interaction.options.getString('cor');
    const footer = interaction.options.getString('footer');
    const image = interaction.options.getString('imagem');

    const embed = new EmbedBuilder().setDescription(description);

    if (title) {
      embed.setTitle(title);
    }
    if (footer) {
      embed.setFooter({ text: footer });
    }
    if (image) {
      if (image.startsWith('http')) {
        embed.setImage(image);
      } else {
        return interaction.reply({
          content:
            'A URL da imagem fornecida é inválida. Ela deve começar com `http`.',
          ephemeral: true,
        });
      }
    }
    if (color) {
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        embed.setColor(color as ColorResolvable);
      } else {
        return interaction.reply({
          content:
            'O formato da cor é inválido. Por favor, use um código HEX (ex: `#A31DDA`).',
          ephemeral: true,
        });
      }
    } else {
      embed.setColor('#A31DDA');
    }

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erro ao enviar o embed:', error);
      await interaction.reply({
        content: 'Ocorreu um erro ao tentar enviar o embed.',
        ephemeral: true,
      });
    }
  },
};
