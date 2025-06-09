const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailydoodle')
        .setDescription("Get today's drawing prompt!"),
    async execute(interaction) {
        await interaction.reply('Flower');
    },
};