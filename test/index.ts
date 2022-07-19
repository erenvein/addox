import { Client, GatewayIntentBits } from '../src/';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    intents: Object.values(GatewayIntentBits)
        .filter((bit) => typeof bit === 'number')
        .reduce((accumulator, bit) => accumulator | (bit as number), 0),
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'Eminem - Lose Yourself', type: 'Listening' }],
        },
    },
    rest: {
        offset: 100,
    },
});

client.connect(process.env.TOKEN as string);

client.on('Ready', async () => {
    console.log('Connected to Discord API!');
});
