const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('autorole')
        .setDescription('Set the autorole for this server')
        .setType('ChatInput')
        .addSubcommand((builder) =>
            builder
                .setName('on')
                .setDescription('Set the autorole for this server')
                .addRoleOption((builder) =>
                    builder
                        .setName('role')
                        .setDescription('The role to set as autorole')
                        .setRequired(true)
                )
                .addChannelOption((builder) =>
                    builder
                        .setName('channel')
                        .setDescription('The channel to send the welcome message in')
                        .setChannelTypes(['GuildText'])
                        .setRequired(false)
                )
        )
        .addSubcommand((builder) =>
            builder.setName('off').setDescription('Disable the autorole for this server')
        )
        .setDmPermission(false)
        .setDefaultMemberPermissions('Administrator'),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const subcommand = interaction.options.pickSubcommand();

        if (subcommand === 'on') {
            const role = interaction.options.pickRole('role');
            const channel = interaction.options.pickChannel('channel');

            const resolved = {};

            role && (resolved.role = role.id);
            channel && (resolved.channel = channel.id);

            interaction.client.db.set(`${interaction.guildId}.autorole`, resolved);

            await interaction.reply({
                content: `Set autorole to **${role.name}**${
                    channel ? ` and welcome channel to <#${channel.id}>` : ''
                }`,
            });
        } else if (subcommand === 'off') {
            interaction.client.db.delete(`${interaction.guildId}.autorole`);

            await interaction.reply({
                content: 'Disabled autorole',
            });
        }
    },
};
