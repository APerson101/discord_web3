import {SlashCommandBuilder} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request')
    .setDescription('request transfer from an account!'),
  async execute(interaction: {reply: (arg0: string) => any;}) {
    await interaction.reply("Request!");
  }
};