import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { config } from '../../config';
import { spawn } from 'child_process';
import path from 'path';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reloadbot')
    .setDescription('[Dono] Reinicia completamente o bot.'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.user.id !== config.ownerId) {
      return interaction.reply({
        content: '❌ Este comando é restrito ao dono do bot.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: '♻️ Reiniciando o bot...',
      ephemeral: true,
    });

    console.log('[BOT] Reinício solicitado pelo dono.');

    const entryFile = path.join(__dirname, '../../index.js');

    spawn(process.argv[0], [entryFile], {
      detached: true,
      stdio: 'inherit',
    });

    process.exit(0);
  },
};
