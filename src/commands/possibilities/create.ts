import {SlashCommandBuilder} from "discord.js";
import {FirebaseMethods} from "../../firebase_methods";
import {createLensProfile} from "../../lens/lens_methods";



const data = new SlashCommandBuilder()
  .setName('createaccount')
  .setDescription('Create new Account with us!');
var execute = async (interaction) => {
  await interaction.reply(`creating new account...`,);
  var newAccount = await create(interaction.user.username, interaction.guild.name);
  await interaction.followUp(`your new account is: ${newAccount.address}`);
  await createLensProfile(interaction.user.username);
  await interaction.followUp(`your new lens profile has been created`);


};
var create = async (username: string, guildName: string) => {
  return await FirebaseMethods.createAccount(username, guildName);
}



export {data, execute};

