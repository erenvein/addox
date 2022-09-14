const { ApplicationCommandBuilder, ChatInputCommandInteraction } = require('../../dist/index.js');

module.exports = {
    ...new ApplicationCommandBuilder()
        .setName('upload-file')
        .setDescription('Upload a file')
        .setType('ChatInput')
        .addAttachmentOption((builder) =>
            builder.setName('file').setDescription('File to upload').setRequired(true)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();

        const attachment = interaction.options.pickAttachment('file');

        await interaction.followUp({
            content: `Uploaded file: **${attachment.filename}**`,
            files: [attachment.url],
        });
    },
};
