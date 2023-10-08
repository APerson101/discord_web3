import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, EmbedBuilder, Guild, GuildMember} from "discord.js";

const sendDM = async (client: Client, id: string, username: string, senderName: string) => {
  var guild: Guild;
  for (let [guildid, value] of client.guilds.cache) {
    console.log('finding guild that matches with:');
    console.log(`Searching ${guildid}`);

    if (guildid == id) {
      console.log(`found ${value.name}`);
      guild = value;
    }
  }
  console.log(guild.members)
  var memberIn: GuildMember;
  var members: Collection<String, GuildMember>;
  members = await guild.members.fetch();

  console.log(members);
  for (let [ـ, member] of members) {
    console.log(`finding member that matches with: ${username}`);
    if (member.user.username == username) {
      console.log(`Searching: ${member.user.username}`);
      memberIn = member;
      await memberIn.send({
        embeds: [new EmbedBuilder()
          .setTitle("Receive funds")
          .setDescription(`${senderName} wants to send xrp 50 to you. Receive?`)
        ],
        components: [new ActionRowBuilder<ButtonBuilder>()
          .addComponents(new ButtonBuilder()
            .setLabel('Confirm')
            .setCustomId('confirm')
            .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
              .setLabel('Cancel')
              .setCustomId('cancel')
              .setStyle(ButtonStyle.Danger)
          )]
      })
    }
  }
}

export {sendDM};

