import axios from "axios";
import {Collection, Events} from "discord.js";
import express from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import discordtoken from "../config.json";
import {ClientExtender} from "./client_extender";
import {sendDM} from "./dm";
import {connectXrpl, disconnectXrpl} from "./ripple_loader";
const app = express();


const client = new ClientExtender();
client.commands = new Collection();
function loadCommands() {
  const foldersPath = path.join(__dirname, 'commands');
  const commandsFolders = fs.readdirSync(foldersPath);
  for (const folder of commandsFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      }
      else {
        console.log(`[WARNING] the command at ${filePath} is missing data or execute`);
      }
    }
  }
}
function loadEvents() {
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => {
        event.execute(...args);
      });
    } else {


      client.on(event.name, async interaction => {
        if (event.name == Events.ThreadCreate) {
          event.execute(interaction);
        }
        else if (interaction.isChatInputCommand()) {
          event.execute(interaction);
        }
        else if (interaction.isAutocomplete()) {
          const command = interaction.client.commands.get(interaction.commandName);
          await command.autocomplete(interaction);
        }


      });
    }
  }
}
const port = 3000;

app.get('/sendtodiscordusername', async (req, res) => {
  res.send("hello world");
  await sendDM(client, "883801424482426950", 'another_user0835', 'babayemi');
});
axios.defaults.baseURL = 'http://localhost:3000'
app.get('/summarize', async (req, res) => {
  console.log("we are here to summarize");
  const channelID = req.query.channelID;
  const unprocessed_messages: any[] = await axios.get(`https://discord.com/api/v/10/channels/${channelID}/messages?limit=100`,
    {headers: {Authorization: "Bot MTEzNzA1NjY2ODk1ODU4ODk3OA.GYzph3.VAYvbKcQ917GWmxryFbVBfRq9ktaCmKVPrOcAs"}});
  res.send(unprocessed_messages);
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost: ${port}`);
});


async function main() {
  loadCommands();
  loadEvents();
  await connectXrpl()
  client.login(discordtoken.token);
}


main().then(async () => {
}).catch(async (error) => {
  await disconnectXrpl();
  console.log(error);
});


// send to discord: 
// initialize express js