import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';

const numberEmojis = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
  '🔟',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enquete')
    .setDescription('Cria uma enquete com reações automáticas.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName('pergunta')
        .setDescription('A pergunta da enquete.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('opcoes')
        .setDescription(
          'As opções da enquete, separadas por ponto e vírgula (;).',
        )
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('pergunta', true);
    const optionsString = interaction.options.getString('opcoes', true);

    const options = optionsString.split(';').map((opt) => opt.trim());

    if (options.length < 2 || options.length > 10) {
      return interaction.reply({
        content: 'Você precisa fornecer entre 2 e 10 opções para a enquete.',
        ephemeral: true,
      });
    }

    const description = options
      .map((option, index) => `${numberEmojis[index]} ${option}`)
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setColor('#FEE75C')
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setFooter({ text: `Enquete criada por ${interaction.user.tag}` });

    try {
      const pollMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });
      for (let i = 0; i < options.length; i++) {
        await pollMessage.react(numberEmojis[i]);
      }
    } catch (error) {
      console.error('Erro ao criar enquete:', error);
      await interaction.followUp({
        content:
          'Ocorreu um erro ao criar a enquete. Verifique minhas permissões de reação.',
        ephemeral: true,
      });
    }
  },
};
