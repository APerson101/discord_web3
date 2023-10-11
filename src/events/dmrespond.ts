import axios from "axios";
import {Attachment, ChannelType, Events, Guild, Message} from 'discord.js';
import fs from "fs";
import {client} from "..";
import {verification} from "../onyxssi/verify_vp";

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot || message.channel.type === ChannelType.GuildText || message.attachments.size === 0) {
      return;
    }
    // Respond to the user via DM
    try {
      await message.author.send('Thank you for uploading a document! We have received it.');
    } catch (error) {
      console.error(`Error sending DM to ${message.author.tag}:`, error);
      await message.reply('An error occurred while trying to send you a DM. Please make sure your DMs are open.');
    }
    // Process the attachments
    message.attachments.forEach(async (attachment: Attachment) => {
      // Do something with the attachment

      console.log(`Received document: ${attachment.name}`);
      console.log(`URL: ${attachment.url}`);
    });
    const savedFilePath = "/Users/abdulhadihashim/Desktop/discordbot/dist/src/onyxssi/vp/proofOfIdentity.jwt"
    const response = await axios.get(message.attachments.first().url, {responseType: 'stream'});
    const streamFile = fs.createWriteStream(savedFilePath
    );
    response.data.pipe(streamFile);
    await message.reply('File downloaded, verifying Credentials');
    var verificationStatus = await verification(savedFilePath);
    if (verificationStatus) {
      // notify user that they have been verified and channels have been unlocked for them
      await message.reply('Verification successfuly');
      const guild_: Guild = client.guilds.cache.get('883801424482426950');
      const verifiedRole = guild_.roles.cache.find(role => role.name == 'Verified');
      const members = await guild_.members.fetch();
      const targetMember = members.get(message.author.id);
      await targetMember.roles.add(verifiedRole);
      message.reply(`Congratulations, you have been verified and added to the private channels.`);

    }
    await new Promise((resolve, reject) => {
      streamFile.on('finish', resolve);
      streamFile.on('error', reject);
    });


  }
}