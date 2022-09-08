import { config } from 'dotenv';
import { resolve } from 'node:path';
import {
    Client,
    GatewayIntentBits,
    GuildTextBasedChannelResolvable,
    EmbedBuilder,
    User,
} from '../src/index';

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

client.ws.on('ready', () => {
    console.log('Online!');
});

client.ws.on('messageCreate', async (message) => {
    const [commandName, ...args] = message.content!.trim().split(/ /g);

    if (commandName === '!ping') {
        return await message.reply({
            content: `Pong! :ping_pong: **${client.ws.ping}**ms`,
        });
    } else if (commandName === '!sil') {
        const amount = args[0] ? +args[0] : 10;

        if (isNaN(amount)) {
            return await message.reply({
                content: 'Lütfen silinecek mesaj sayısını belirtin.',
            });
        } else if (amount > 100) {
            return await message.reply({
                content: "**100**'den fazla mesaj silemem!",
            });
        } else if (amount <= 1) {
            return await message.reply({
                content: 'En az **1** mesaj silebilirim!',
            });
        }

        //@ts-ignore
        (message.channel as GuildTextBasedChannelResolvable)
            .bulkDelete(amount)
            .then((deletions) => {
                message.reply({
                    content: `**${deletions.size}** adet mesaj silindi!`,
                });
            });
    } else if (commandName === '!avatar') {
        const user = (message.mentions.users.first() as User) || message.author;

        return await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('DarkVividPink')
                    .setAuthor({
                        icon_url: user.avatarURL({ dynamic: true }),
                        name: `${user.tag}'s Avatar`,
                    })
                    .setImage({
                        url: user.avatarURL({ dynamic: true }),
                    })
                    .setFooter({
                        icon_url: message.author.avatarURL({ dynamic: true }),
                        text: `Requested by ${message.author.tag}`,
                    }),
            ],
        });
    }

    return;
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
