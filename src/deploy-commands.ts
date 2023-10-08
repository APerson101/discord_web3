import {REST, Routes} from "discord.js";
import * as fs from 'node:fs';
import * as path from 'node:path';
const {clientId, guildId, token} = require("../config.json");

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] there The command at ${filePath} is missing a required "data" or "execute" property. and contain only ${command}`);
    }
  }
}

const rest = new REST().setToken(token);
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {body: commands},
    )) as any;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();