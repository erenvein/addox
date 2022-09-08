import { config } from 'dotenv';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { Client, Collection, GatewayIntentBits } from '../src/index';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'frappenin annesi ile', type: 'Playing' }],
        },
        intents: Object.values(GatewayIntentBits).reduce(
            (accumulator, intent) => accumulator | (intent as number),
            0
        ),
        shardCount: 1,
    },
    rest: {
        offset: 100,
    },
});

for (const file of readdirSync(resolve(__dirname, 'events'))) {
    const event = require(`./events/${file}`).default;
    client.ws.on(event.name, event.execute);
}

client.ws.connect(process.env.TOKEN!);
