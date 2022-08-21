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

client.ws.on('ready', () => {
    console.log('Online!');
});

client.ws.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        message.reply({
            content: `Pong! :ping_pong: **${client.ws.ping}**ms`,
        });
    }
});

client.ws.on('shardError', (shard, error) => {
    throw error;
});

client.ws.on('shardSpawn', (shard) => {
    console.log(`Shard ${shard.id + 1} spawned.`);
});

client.ws.on('shardReady', async (shard) => {
    console.log(`Shard ${shard.id + 1} ready.`);
});

client.ws.on('shardClosed', (shard, code, reason) => {
    console.log(`Shard ${shard.id + 1} closed.\nReason: ${reason}\nCode: ${code}`);
});

client.ws.on('shardReconnect', (shard) => {
    console.log(`Shard ${shard.id + 1} reconnecting.`);
});

client.ws.on('shardResumed', (shard) => {
    console.log(`Shard ${shard.id + 1} resumed.`);
});

client.ws.on('shardDeath', (shard, code, reason) => {
    console.log(`Shard ${shard.id + 1} death.\nReason: ${reason}\nCode: ${code}`);
});

client.ws.connect(process.env.TOKEN!);

//allah var
//-- cpp, c, go, rust ve javaya boşaldım
