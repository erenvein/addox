const {
    ChatInputCommandInteraction,
    AnyInteraction,
    ModalSubmitInteraction,
} = require('../../dist/index.js');

module.exports = {
    name: 'interactionCreate',
    /**
     *
     * @param {AnyInteraction} interaction
     */
    async execute(interaction) {
        if (interaction instanceof ChatInputCommandInteraction) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (command) {
                command.execute(interaction);
            }
        } else if (interaction instanceof ModalSubmitInteraction) {
            if (interaction.customId === 'modal-test') {
                const variable1 = interaction.values.pick('variable1');

                await interaction.reply({
                    content: `Variable 1: **${variable1}**`,
                    flags: 'Ephemeral',
                });
            }
        }
    },
};
