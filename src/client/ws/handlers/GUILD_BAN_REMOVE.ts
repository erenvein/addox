import { type GatewayGuildBanRemoveDispatch, BaseWebSocketHandler } from '../../../index';

export default class GuildBanRemoveHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildBanRemove');
    }

    public override handle({ d }: GatewayGuildBanRemoveDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const ban = guild.caches.bans.cache.get(d.user.id);

            if (ban) {
                this.shard.manager.emit('guildBanRemove', ban);
            }
        }
    }
}
