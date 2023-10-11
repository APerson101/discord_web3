import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js";
import {FirebaseMethods} from "../../firebase_methods";



const data = new SlashCommandBuilder()
  .setName('createaccount')
  .setDescription('Create new Account with us!')
  .addStringOption(option => option.setName("name")
    .setDescription('Enter your full name')
    .setRequired(true))
  .addStringOption(option => option.setName("insitution")
    .setDescription('Enter your Insitution name')
    .setRequired(true))
  .addStringOption(option => option.setName("instagram")
    .setDescription('Enter your instagram username')
    .setRequired(true))
var execute = async (interaction) => {
  const name: string = interaction.options.getString('name');
  const insitution: string = interaction.options.getString('insitution');
  const instagram: string = interaction.options.getString('instagram');
  await interaction.reply(`creating new account...`,);
  var newAccount = await create(interaction.user.username, interaction.guild.name, name, insitution, instagram);
  await interaction.followUp(`your new account is: ${newAccount.address}`);

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel('VC')
        .setURL('http://localhost:3000/download/vc')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('VC-Signed')
        .setURL('http://localhost:3000/download/vc-signed')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('VP')
        .setURL('http://localhost:3000/download/vp')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('VP-signed')
        .setURL('http://localhost:3000/download/vpsigned')
        .setStyle(ButtonStyle.Link),
    );

  // Send the message with the ActionRow
  const replyMessage = await interaction.followUp({
    content: 'Download Credentials',
    components: [row],
  });
  // https://discord.gg/N2A4pPNf

  // await createLensProfile(interaction.user.username);
  // await interaction.followUp(`your new lens profile has been created`);


};
var create = async (username: string, guildName: string, name: string, insitution: string, instagram: string) => {
  return await FirebaseMethods.createAccount(username, guildName, name, insitution, instagram);
}



export {data, execute};

