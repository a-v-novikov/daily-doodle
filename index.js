// Prisma
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
// Node
const fs = require('node:fs');
const path = require('node:path');
// Discord.js
const { Client, Collection, Events, Guild, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.GuildCreate, async (guild) => {
    const guild_id = guild.id;
    const newGuild = await prisma.guilds.upsert(
        {
            where: {
                discord_id: guild_id,
            },
            update: {
            },
            create: {
                discord_id: guild_id,
            },
        }
    );
});

// Log in to Discord with your client's token
client.login(token);
