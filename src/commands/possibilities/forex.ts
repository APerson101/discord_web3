import {SlashCommandBuilder} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forex')
    .setDescription('Start currency exchange!'),
  async execute(interaction: {reply: (arg0: string) => any;}) {
    await interaction.reply("forex pong!");
  }
};