const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('opt-test')
        .setDescription('Option test!')
        .setType('ChatInput')
        .addStringOption((option) =>
            option.setName('string').setDescription('String option').setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('integer').setDescription('Integer option').setRequired(true)
        )
        .addRoleOption((option) =>
            option.setName('role').setDescription('Role option').setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName('channel').setDescription('Channel option').setRequired(true)
        )
        .addUserOption((option) =>
            option.setName('user').setDescription('User option').setRequired(true)
        )
        .setDmPermission(false),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const string = interaction.options.pickString('string');
        const integer = interaction.options.pickInteger('integer');
        const role = interaction.options.pickRole('role');
        const channel = interaction.options.pickChannel('channel');
        const user = interaction.options.pickUser('user');

        await interaction.reply({
            content: `String: **${string}**
Integer: **${integer}**
Role: **${role.name}**
Channel: **${channel.name}**
User: **${user.tag}**`,
        });
    },
};
