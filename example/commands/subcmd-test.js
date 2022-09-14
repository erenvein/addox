const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('subcmd-test')
        .setDescription('Subcommand test!')
        .setType('ChatInput')
        .addSubcommand((builder) => builder.setName('on').setDescription('Subcommand!'))
        .addSubcommand((builder) => builder.setName('off').setDescription('Subcommand!')),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const subcommand = interaction.options.pickSubcommand();

        if (subcommand === 'on') {
            await interaction.reply({
                content: 'Subcommand on!',
            });
        } else if (subcommand === 'off') {
            await interaction.reply({
                content: 'Subcommand off!',
            });
        }
    },
};
