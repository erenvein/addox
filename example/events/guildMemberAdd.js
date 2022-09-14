module.exports = {
    name: 'guildMemberAdd',
    /**
     *
     * @param {import("../../src/index").GuildMember} member
     */
    execute(member) {
        const autorole = member.client.db.get(`${member.guild.id}.autorole`);

        if (autorole) {
            const role = member.guild.caches.roles.cache.get(autorole.role);

            member.caches.roles.add(autorole.role).catch(() => {});

            if (autorole.channel) {
                const channel = member.guild.caches.channels.cache.get(autorole.channel);

                if (channel) {
                    channel
                        .send({
                            content: `**${member.user?.tag}** has joined the server! **${role.name}** role have been assigned.`,
                        })
                        .catch(() => {});
                }
            }
        }
    },
};
