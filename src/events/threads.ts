import {Events, Message, ThreadChannel} from 'discord.js';

module.exports = {
  name: Events.ThreadCreate,
  async execute(thread: ThreadChannel) {
    var message = await thread.fetchStarterMessage()
    var first_message: Message<true> = (await thread.messages.fetch({limit: 1})).first();
    var timeStamp = thread.createdAt
    var post_topic = thread.name
    console.log(post_topic, first_message.content, timeStamp, first_message.author.username)
    // post it
  }
}