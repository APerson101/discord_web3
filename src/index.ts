import axios from "axios";
import {Collection, Events} from "discord.js";
import express, {Request, Response} from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import discordtoken from "../config.json";
import {ClientExtender} from "./client_extender";
import {sendDM} from "./dm";
import {connectXrpl, disconnectXrpl} from "./ripple_loader";
const app = express();


export const client = new ClientExtender();
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

        else if (event.name == Events.GuildMemberAdd) {
          event.execute(interaction);
        }

        else if (event.name == Events.MessageCreate) {
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




// Serve static files from the 'public' directory
app.use(express.static('onyxssi/vc'));

// Define a route to handle file download
app.get('/download/vc', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'onyxssi/issued_vcs.json',);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Set the appropriate headers for the download
    res.setHeader('Content-Disposition', `attachment; filename=vc.json`);
    res.setHeader('Content-Type', 'application/json')

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});
// Define a route to handle file download
app.get('/download/vc-signed', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'onyxssi/vc/proofOfIdentity.jwt',);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    // Set the appropriate headers for the download
    res.setHeader('Content-Disposition', `attachment; filename=signed_vc.jwt`);
    res.setHeader('Content-Type', 'application/octet-stream')

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
  app.get('/download/vp', (req: Request, res: Response) => {
    const filePath = path.join(__dirname, 'onyxssi/vp/proofOfIdentity.json',);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found');
      }

      // Set the appropriate headers for the download
      res.setHeader('Content-Disposition', `attachment; filename=vp.json`);
      res.setHeader('Content-Type', 'application/json')

      // Create a read stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  });
  app.get('/download/vpsigned', (req: Request, res: Response) => {
    const filePath = path.join(__dirname, 'onyxssi/vp/proofOfIdentity.jwt',);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found');
      }

      // Set the appropriate headers for the download
      res.setHeader('Content-Disposition', `attachment; filename=signed_vp.jwt`);
      res.setHeader('Content-Type', 'application/octet-stream')

      // Create a read stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  });
});

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