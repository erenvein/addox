const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('subcmd-group-test')
        .setDescription('Subcommand test!')
        .setType('ChatInput')
        .addSubcommandGroup((builder) =>
            builder
                .setName('subcmd')
                .setDescription('Subcommand group!')
                .addSubcommand((builder) => builder.setName('on').setDescription('Subcommand!'))
                .addSubcommand((builder) => builder.setName('off').setDescription('Subcommand!'))
        ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const focusted = interaction.options.pickSubcommandGroup();

        if (focusted === 'on') {
            await interaction.reply({
                content: 'Subcommand on!',
            });
        } else if (focusted === 'off') {
            await interaction.reply({
                content: 'Subcommand off!',
            });
        }
    },
};
