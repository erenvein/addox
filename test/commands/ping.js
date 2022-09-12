const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!')
        .setType('ChatInput'),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.reply({
            content: `Pong! :ping_pong: **${interaction.client.ws.ping}**ms`,
            flags: 'Ephemeral',
        });
    },
};
