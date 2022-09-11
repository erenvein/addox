import {
    BaseWebSocketHandler,
    GatewayChannelCreateDispatch,
    GuildBasedChannelResolvable,
} from '../../../index';

export default class ChannelDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelCreateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        this.shard.manager.client.caches.channels.delete(d.id);

        if (guild) {
            const channel = guild.caches.channels.cache.get(d.id);

            if (channel) {
                this.removeChannelFromEveryting(channel.id, guild);
                this.shard.manager.emit('channelDelete', channel);
            }
        }
    }
}
