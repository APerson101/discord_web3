import {SlashCommandBuilder} from "discord.js";
import {FirebaseMethods} from "../../firebase_methods";
import {RippleFunctions} from "../../ripple_commands";
const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Get account balance!');
const execute = async (interaction) => {
  await interaction.reply("Getting account balance!");
  var address = await FirebaseMethods.getAddressFromUsername(interaction.user.username, interaction.guild.name);
  var balance = await getBalance(address);
  await interaction.followUp(`available balance is ${balance}`)
}

const getBalance = async (address: string) => {
  return await RippleFunctions.getBalance(address);
}
export {data, execute};
