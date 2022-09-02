import {
    BaseWebSocketHandler,
    GatewayChannelCreateDispatch,
    GuildBasedChannelResolvable,
} from '../../../index';

export default class ChannelCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelCreateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const channel = this.shard.manager.client.caches.channels._createChannel(
                d,
                guild
            ) as GuildBasedChannelResolvable;

            guild.caches.channels.cache.set(channel.id, channel);
            this.shard.manager.client.caches.channels.cache.set(channel.id, channel);

            this.shard.manager.emit('channelCreate', channel);
        }
    }
}
