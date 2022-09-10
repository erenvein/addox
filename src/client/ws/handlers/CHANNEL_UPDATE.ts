import {
    BaseWebSocketHandler,
    GatewayChannelUpdateDispatch,
    GuildBasedChannelResolvable,
} from '../../../index';

export default class ChannelUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelUpdateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            let _channel = guild.caches.channels.cache.get(d.id);

            if (_channel) {
                const channel = _channel;

                //@ts-ignore
                _channel = _channel._patch(d);

                guild.caches.channels.cache.set(channel.id, _channel);
                this.shard.manager.client.caches.channels.cache.set(channel.id, _channel);

                this.shard.manager.emit('channelUpdate', channel, _channel);
            }
        }
    }
}
