import { Client, GatewayIntentBits } from '../src/';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'Eminem - Lose Yourself', type: 'Listening' }],
        },
        intents: Object.values(GatewayIntentBits)
            .filter((bit) => typeof bit === 'number')
            .reduce((accumulator, bit) => accumulator | (bit as number), 0),
        shardCount: 3,
    },
    rest: {
        offset: 100,
    },
});

client.on('Ready', () => {
    console.log('Online!');
});

client.on('ShardError', (shard, error) => {
    throw error;
});

client.on('ShardSpawn', (shard) => {
    console.log(`Shard ${shard.id + 1} spawned.`);
});

client.on('ShardReady', (shard) => {
    console.log(`Shard ${shard.id + 1} ready.`);
});

client.on('ShardDisconnect', (shard, reason) => {
    console.log(`Shard ${shard.id + 1} closed.\nReason: ${reason}`);
});

client.ws.connect(process.env.TOKEN as string);
