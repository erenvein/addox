const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');
const { promisify, inspect } = require('node:util');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates code')
        .setType('ChatInput')
        .addStringOption((builder) =>
            builder.setName('code').setDescription('The code to evaluate').setRequired(true)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        if (interaction.user.id !== '931957993925378050') {
            await interaction.reply({
                content: 'You are not allowed to use this command!',
            });
            return;
        }

        const code = interaction.options.pickString('code');

        await interaction.deferReply({
            flags: 'Ephemeral',
        });

        try {
            const evaled = await eval(code);
            const inspected = inspect(evaled, { depth: 0 });

            await interaction.followUp({
                content: `\`\`\`js\n${
                    inspected.length > 2000 ? inspected.slice(0, 2000) + ' ...' : inspected
                }\`\`\``,
            });
        } catch (error) {
            await interaction.followUp({
                content: `\`\`\`js\n${
                    error.stack.length > 2000 ? error.stack.slice(0, 2000) + ' ...' : error.stack
                }\`\`\``,
            });
        }
    },
};
