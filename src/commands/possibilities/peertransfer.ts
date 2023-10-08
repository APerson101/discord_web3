import {SlashCommandBuilder} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('p2p')
    .setDescription('Setup peer to peer exchange!'),
  async execute(interaction: {reply: (arg0: string) => any;}) {
    await interaction.reply("P2P!");
  }
};