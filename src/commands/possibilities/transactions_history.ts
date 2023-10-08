import {SlashCommandBuilder} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transactionhistory')
    .setDescription('Get history of transactions!'),
  async execute(interaction: {reply: (arg0: string) => any;}) {
    // run function using the interaction.user to get username;
    await interaction.reply("transactions !");
  }
};