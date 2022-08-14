import {
    BaseWebSocketHandler,
    GatewayGuildMemberUpdateDispatch,
    GuildMember,
    type APIGuildMember,
} from '../../../index';

export default class GuildMemberUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildMemberUpdate');
    }

    public override handle({ d }: GatewayGuildMemberUpdateDispatch) {
        let guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            let _member = guild.caches.members.cache.get(d.user.id);

            if (_member) {
                const member = _member;

                _member = _member._patch(d as APIGuildMember);

                guild.caches.members.cache.set(member.id, _member);
                this.shard.manager.emit('guildMemberUpdate', member, _member);
            } else {
                const member = new GuildMember(
                    this.shard.manager.client,
                    guild,
                    d as APIGuildMember
                );

                guild.caches.members.cache.set(member.id, member);
                this.shard.manager.emit('guildMemberAdd', member);
            }
        }
    }
}
