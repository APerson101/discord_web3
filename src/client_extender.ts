import {Client, Collection, GatewayIntentBits, Partials} from "discord.js";

export class ClientExtender extends Client {
  commands: Collection<unknown, unknown>;
  constructor(
  ) {
    super({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages,], partials: [Partials.Channel]});
  }
}