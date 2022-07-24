import {
    type GatewayGuildBanAddDispatch,
    GuildBan,
    BaseWebSocketHandler,
} from '../../..';

export default class GuildBanAddHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildBanAdd');
    }

    public handle({ d }: GatewayGuildBanAddDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            guild.caches.bans
                .fetch(d.user.id)
                .then((ban) => this.shard.manager.client.emit('guildBanAdd', ban as GuildBan));
        }
    }
}
