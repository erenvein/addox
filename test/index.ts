import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Client } from '../src/index';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'annen ile', type: 'Playing' }],
        },
        intents: 131071,
        shardCount: 1,
    },
    rest: {
        offset: 100,
    },
});

client.on('ready', () => {
    console.log('Online!');
});

client.on('shardError', (shard, error) => {
    throw error;
});

client.on('shardSpawn', (shard) => {
    console.log(`Shard ${shard.id + 1} spawned.`);
});

client.on('shardReady', async (shard) => {
    console.log(`Shard ${shard.id + 1} ready.`);
});

client.on('shardClosed', (shard, code, reason) => {
    console.log(`Shard ${shard.id + 1} closed.\nReason: ${reason}\nCode: ${code}`);
});

client.on('shardReconnect', (shard) => {
    console.log(`Shard ${shard.id + 1} reconnecting.`);
});

client.on('shardResumed', (shard) => {
    console.log(`Shard ${shard.id + 1} resumed.`);
});

client.on('shardDeath', (shard, code, reason) => {
    console.log(`Shard ${shard.id + 1} death.\nReason: ${reason}\nCode: ${code}`);
});

client.ws.connect(process.env.TOKEN!);
