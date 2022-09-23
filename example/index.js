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
    cache: (client, stale) => {
        client.caches.channels.cache.forEach((channel) => {
            stale(channel.caches.messages?.cache, 1000 * 60 * 60 * 2);
            stale(channel.caches.threads?.cache, 1000 * 60 * 60 * 24);
            stale(channel.caches.invites.cache, 1000 * 60 * 60);
        });

        client.caches.guilds.cache.forEach((guild) => {
            stale(guild.caches.bans.cache, 1000 * 60 * 60 * 24 * 3);
            stale(guild.caches.scheduledEvents.cache, 1000 * 60 * 60 * 7);
            stale(guild.caches.stageInstances.cache, 1000 * 60 * 60 * 7);
            stale(guild.caches.invites.cache, 1000 * 60 * 60 * 24 * 2);
            stale(guild.caches.autoModerationRules.cache, 1000 * 60 * 60);
            stale(guild.caches.presences, 1000 * 60 * 60 * 24);

            guild.caches.channels.cache.forEach((channel) => {
                stale(channel.caches.messages?.cache, 1000 * 60 * 60 * 2);
                stale(channel.caches.threads?.cache, 1000 * 60 * 60 * 24);
                stale(channel.caches.invites.cache, 1000 * 60 * 60);
            });
        });
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
