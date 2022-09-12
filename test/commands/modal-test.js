const {
    ApplicationCommandBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
} = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('modal-test')
        .setDescription('Modal test!')
        .setType('ChatInput'),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId('modal-test')
                .setTitle('Modal Test')
                .setComponents(
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setCustomId('variable1')
                            .setPlaceholder('Enter variable 1')
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setLabel("Enter variable 1's value")
                            .setRequired(true)
                            .setStyle('Short')
                    )
                )
        );
    },
};
