import { type GatewayGuildBanRemoveDispatch, BaseWebSocketHandler } from '../../..';

export default class GuildBanRemoveHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildBanRemove');
    }

    public handle({ d }: GatewayGuildBanRemoveDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const ban = guild.caches.bans.cache.get(d.user.id);

            if (ban) {
                this.shard.manager.client.emit('guildBanRemove', ban);
            }
        }
    }
}
