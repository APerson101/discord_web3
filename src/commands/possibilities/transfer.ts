import {AutocompleteInteraction, Collection, GuildMember, SlashCommandBuilder} from "discord.js";
import {FirebaseMethods} from "../../firebase_methods";
import {RippleFunctions} from "../../ripple_commands";

const data = new SlashCommandBuilder()
  .setName('transfer')
  .setDescription('Transfer token to an account!')
  .addIntegerOption(option => option.setName('amount')
    .setDescription('amount to send')
    .setRequired(true)
  )
  .addStringOption(option => option.setName('currency')
    .setDescription('The currency to transfer')
    .setRequired(true)
    .addChoices(
      {name: 'ripple', value: 'xrp'},
      {name: "dollar", value: "usdc"},
      {name: "euro", value: "eurc"},
      {name: "pounds", value: "gbpc"},
    )
  )
  .addStringOption(option => option.setName("receiver")
    .setDescription('Enter the discord username of the receiver')
    .setRequired(true)
    .setAutocomplete(true));

const autocomplete = async (interaction: AutocompleteInteraction) => {
  const focusedValue = interaction.options.getFocused();
  var members: Collection<String, GuildMember>;
  if (interaction.guild.members.cache == null) {
    members = await interaction.guild.members.fetch();
  }

  else {
    members = interaction.guild.members.cache;
  }
  const allMembersNames: string[] = [];
  for (let [_, value] of members) {
    allMembersNames.push(value.user.username);
  }
  const filtered = allMembersNames.filter(choice => choice.startsWith(focusedValue));
  await interaction.respond(
    filtered.map(choice => ({name: choice, value: choice})),
  );
};
const execute = async (interaction) => {
  const receiver: string = interaction.options.getString('receiver');
  const currency: string = interaction.options.getString('currency');
  const amount: number = interaction.options.getInteger('amount');
  await interaction.reply(`sending ${amount} ${currency} to ${receiver}...`);
  const guild = interaction.guild.name;
  const senderUsername = interaction.user.username;
  var id = await executeTransfer(receiver, currency, amount, senderUsername, guild);
  // fetch ripple address from username, then send
  await interaction.followUp(`Successfullly sent with id: ${id}`);
}

const executeTransfer = async (receiverUsername: string,
  currency: string,
  amount: number,
  senderUsername: string,
  guild: string
) => {
  var receiverAddress = await FirebaseMethods.getAddressFromUsername(receiverUsername, guild);
  var senderAccount = await FirebaseMethods.getAccountFromUsername(senderUsername, guild);
  var id = await RippleFunctions.sendXrp(receiverAddress, senderAccount.address, amount.toString(), senderAccount.seed);
  await FirebaseMethods.saveTransaction(senderUsername, id);
  return id;
}

export {autocomplete, data, execute};

