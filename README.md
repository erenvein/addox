# ADDOX

### About

addox is an easy-to-use [Node.js](https://nodejs.org/) library for interacting with the [Discord API](https://discord.com/developers/docs/)'s.

### Installation

```bash
npm install addox
yarn add addox
```

### Warn

Node.js v16.6.0 or higher is required.

### Features

-   Easy to use
-   Object-oriented
-   Lightweight
-   Fast
-   TypeScript support

### Optional Dependencies

-   [zlib-sync](https://www.npmjs.com/package/zlib-sync) for WebSocket data compression and decompression
-   [erlpack](https://www.npmjs.com/package/erlpack) for WebSocket data serialization and deserialization

### Example ping-pong, buttons and embeds

```js
const {
    Client,
    ApplicationCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
} = require('../dist/index.js');
const client = new Client({
    ws: {
        intents: ['Guilds'],
    },
});

client.ws.on('ready', () => {
    const commands = [
        new ApplicationCommandBuilder().setName('ping').setDescription('Replies with pong!'),
        new ApplicationCommandBuilder()
            .setName('select-color')
            .setDescription('You choose your favorite color!'),
        new ApplicationCommandBuilder().setName('embed').setDescription('Replies with embed!'),
    ];

    client.caches.commands
        .set(commands)
        .then(() => console.log('Application commands (/) registered!'))
        .catch(console.error);

    console.log(`Logged in as ${client.user.tag}!`);
});

client.ws.on('interactionCreate', async (interaction) => {
    if (interaction.type === 'ApplicationCommand' && interaction.commandType === 'ChatInput') {
        switch (interaction.commandName) {
            case 'ping':
                await interaction.reply({
                    content: `Pong! **${client.ws.ping}**ms`,
                });
                break;
            case 'select-color':
                await interaction.reply({
                    content: `**Please Select Your Favorite Color!**`,
                    flags: 'Ephemeral',
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('color_red')
                                .setLabel('Red')
                                .setStyle('Danger'),
                            new ButtonBuilder()
                                .setCustomId('color_green')
                                .setLabel('Green')
                                .setStyle('Success'),
                            new ButtonBuilder()
                                .setCustomId('color_blue')
                                .setLabel('Blue')
                                .setStyle('Primary')
                        ),
                    ],
                });
                break;
            case 'embed':
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Embed')
                            .setDescription('This is an embed!')
                            .setColor('Blue')
                            .setFooter({
                                text: 'Addox',
                                icon_url: client.user.avatarURL(),
                            })
                            .setTimestamp(),
                    ],
                });
                break;
        }
    } else if (interaction.type === 'MessageComponent') {
        if (interaction.customId.startsWith('color_')) {
            const selectedColor = interaction.customId.split('_')[1];
            const color = {
                red: '🔴',
                green: '🟢',
                blue: '🔵',
            }[selectedColor];

            await interaction.update({
                content: `**Your favorite color is ${color} ${selectedColor}!**`,
                components: [],
            });
        }
    }
});

client.ws.connect('Your super secret token');
```

### Useful Links

-   [Discord API](https://discord.com/developers/docs/)
-   [Github](https://github.com/deliever42/addox)
-   [NPM](https://www.npmjs.com/package/addox)
-   Documentation: Soon!

### Contributing

If you want to contribute to addox, you can do so by forking the repository and submitting a pull request.

### License

addox is licensed under the [GPL 3.0](https://en.wikipedia.org/wiki/GNU_General_Public_License#Version_3)
