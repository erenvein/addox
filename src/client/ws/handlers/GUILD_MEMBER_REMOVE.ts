import { type GatewayGuildMemberRemoveDispatch, BaseWebSocketHandler } from '../../../index';

export default class GuildMemberRemoveHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildMemberRemove');
    }

    public override handle({ d }: GatewayGuildMemberRemoveDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const member = guild.caches.members.cache.get(d.user.id);

            if (member) {
                guild.caches.members.cache.delete(member.id);
                this.shard.manager.emit('guildMemberRemove', member);
            }
        }
    }
}
