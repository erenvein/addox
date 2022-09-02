import {
    type GatewayGuildBanAddDispatch,
    User,
    BaseWebSocketHandler,
    type GuildBan,
} from '../../../index';

export default class GuildBanAddHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayGuildBanAddDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        this.shard.manager.client.caches.users.cache.set(
            d.user.id,
            new User(this.shard.manager.client, d.user)
        );

        if (guild) {
            guild.caches.bans
                .fetch(d.user.id)
                .then((ban) => {
                    this.shard.manager.emit('guildBanAdd', ban as GuildBan);
                })
                .catch(() => {});
        }
    }
}
