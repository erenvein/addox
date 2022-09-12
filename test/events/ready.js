const { gray, green, magenta } = require('colorette');
const { resolve } = require('node:path');
const { readdirSync } = require('node:fs');

module.exports = {
    name: 'ready',
    /**
     *
     * @param {import("../../src/index").Client} client
     */
    execute(client) {
        console.log(
            `[${magenta(`LOG/${green('INFO')}`)}] Logged in as ${gray(client.user.username)}`
        );

        for (const file of readdirSync(resolve(__dirname, '..', 'commands'))) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }

        client.caches.commands.set(client.commands.array()).then(() => {
            console.log(
                `[${magenta(`LOG/${green('SUCCESS')}`)}] Registered ${gray(
                    client.commands.size
                )} commands.`
            );
        });
    },
};
