import { config } from 'dotenv';
import { resolve } from 'node:path';
import { Client, GatewayIntentBits } from '../src/index';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    ws: {
        presence: {
            status: 'dnd',
            activities: [{ name: 'annen ile', type: 'Playing' }],
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

client.ws.on('ready', () => {
    console.log('Online!');
});

client.ws.on('messageCreate', async (message) => {
    const [commandName, ...args] = message.content!.trim().split(/ /g);

    if (commandName === '!ping') {
        message.reply({
            content: `Pong! :ping_pong: **${client.ws.ping}**ms`,
        });
    } else if (commandName === '!sil') {
        const amount = args[0] ? parseInt(args[0]) : 1;
        if (amount > 100) {
            message.reply({
                content: "100'den fazla mesaj silemem!",
            });
        }

        //@ts-ignore
        message.channel!.bulkDelete(amount);
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
