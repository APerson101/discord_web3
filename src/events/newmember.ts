import {Events, GuildMember} from 'discord.js';

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    member.send(`Welcome to the server, ${member.user.username}! To complete the verification process, please upload your verification document in this channel.`)
      .then(() => {
        console.log(`Sent a welcome message to ${member.user.tag}`);
      })
      .catch((error) => {
        console.error(`Error sending a welcome message to ${member.user.tag}: ${error}`);
      });
  }
}