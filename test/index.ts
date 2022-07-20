import { Client, GatewayIntentBits } from '../src/';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'annen ile', type: 'Playing' }],
        },
        intents: Object.values(GatewayIntentBits)
            .filter((bit) => typeof bit === 'number')
            .reduce((accumulator, bit) => accumulator | (bit as number), 0),
        shardCount: 2,
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

client.on('ShardReady', async (shard) => {
    console.log(`Shard ${shard.id + 1} ready.`);
});

client.on('ShardClosed', (shard, code, reason) => {
    console.log(`Shard ${shard.id + 1} closed.\nReason: ${reason}\nCode: ${code}`);
});

client.on('ShardReconnect', (shard) => {
    console.log(`Shard ${shard.id + 1} reconnecting.`);
});

client.on('ShardResumed', (shard) => {
    console.log(`Shard ${shard.id + 1} resumed.`);
});

client.on('ShardDeath', (shard) => {
    console.log(`Shard ${shard.id + 1} death.`);
});

client.ws.connect(process.env.TOKEN as string);
