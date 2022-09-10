import {
    BaseWebSocketHandler,
    type GatewayMessageUpdateDispatch,
    Message,
    type APIMessage,
    type GuildTextBasedChannelResolvable,
} from '../../../index';

export default class MessageUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        const channel = this.shard.manager.client.caches.channels.cache.get(
            d.channel_id
        ) as GuildTextBasedChannelResolvable;

        if (channel) {
            let _message = channel.caches.messages.cache.get(d.id);

            if (_message) {
                const message = _message;

                _message = _message._patch(d);

                channel.caches.messages.cache.set(d.id, _message);
                this.shard.manager.emit('messageUpdate', message, _message);
            }
        }
    }
}
