## Discord API Wrapper

### About

adox is an easy-to-use [Nodejs](https://nodejs.org/) library for interacting with the [Discord API](https://discord.com/developers/docs/)'s.

### Installation

```bash
npm install adox
yarn add adox
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

### Example ping-pong

```js
const { Client, ApplicationCommandBuilder } = require('adox');
const client = new Client({
    ws: {
        intents: ['Guilds'],
    },
});

client.ws.on('ready', () => {
    const commands = [
        new ApplicationCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    ];

    client.caches.commands
        .set(commands)
        .then(() => console.log('Application commands (/) registered!'))
        .catch(console.error);

    console.log(`Logged in as ${client.user.tag}!`);
});

client.ws.on('interactionCreate', async (interaction) => {
    if (interaction.commandType === 'ChatInput' && interaction.commandName === 'ping') {
        await interaction.reply({
            content: `Pong! **${client.ws.ping}**ms`,
            flags: 'Ephemeral',
        });
    }
});

client.ws.connect('Your super secret token');
```

### Useful Links

-   [Discord API](https://discord.com/developers/docs/)
-   [Github](https://github.com/deliever42/adox)
-   [NPM](https://www.npmjs.com/package/adox)
-   [Documentation] Soon!

### License

adox is licensed under the [GPL 3.0](https://en.wikipedia.org/wiki/GNU_General_Public_License#Version_3)
