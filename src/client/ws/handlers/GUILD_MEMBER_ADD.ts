import { type GatewayGuildMemberAddDispatch, GuildMember, BaseWebSocketHandler } from '../../../index';

export default class GuildMemberAddHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildMemberAdd');
    }

    public override handle({ d }: GatewayGuildMemberAddDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const member = new GuildMember(this.shard.manager.client, guild, d);

            guild.caches.members.cache.set(member.id, member);
            this.shard.manager.emit('guildMemberAdd', member);
        }
    }
}
