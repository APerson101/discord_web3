import axios from "axios";
import {SlashCommandBuilder} from "discord.js";
import {CouncilMethods} from "../../council";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('summarize the current conversation in the channel'),
  async execute(interaction) {
    await interaction.reply("Summarizing..");
    const channelID = interaction.channelId;
    const unprocessed_messages: any[] = await axios.get(`/summarize`, {params: {channelID: channelID}});
    var processed_messages = '';
    for (const message of unprocessed_messages) {
      processed_messages += `${message.author}[${message.timestamp}] ${message.content}\n`
    }
    const summary = await CouncilMethods.fetchSummary(processed_messages);
    await interaction.followUp(summary);
  }
};