const { config } = require('dotenv');
const { resolve } = require('node:path');
const { readdirSync } = require('node:fs');
const { gray, green, magenta } = require('colorette');
const { Client, GatewayIntentBits, Collection } = require('../dist/index.js');
const { JsonDatabase } = require('erax.db');

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'frappenin annesi ile', type: 'Playing' }],
        },
        intents: Object.values(GatewayIntentBits).reduce(
            (accumulator, intent) => accumulator | intent,
            0
        ),
        shardCount: 1,
    },
    rest: {
        offset: 100,
    },
});

client.events = new Collection();
client.commands = new Collection();

client.db = new JsonDatabase({
    filePath: resolve(__dirname, 'db.json'),
    space: 4,
    backup: {
        enabled: false,
    },
});

for (const file of readdirSync(resolve(__dirname, 'events'))) {
    const event = require(`./events/${file}`);
    client.ws.on(event.name, event.execute);

    client.events.set(event.name, event);
}

console.log(
    `[${magenta(`LOG/${green('SUCCESS')}`)}] Registered ${gray(client.events.size)} events.`
);

client.ws.connect(process.env.TOKEN);
