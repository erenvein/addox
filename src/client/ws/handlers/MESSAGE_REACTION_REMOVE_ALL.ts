import {
    BaseWebSocketHandler,
    type GatewayMessageReactionRemoveAllDispatch,
    MessageableChannelResolvable,
} from '../../../index';

export default class MessageReactionRemoveAllHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveAllDispatch) {
        const channel = this.shard.manager.client.caches.channels.cache.get(d.channel_id) as MessageableChannelResolvable;

        if (channel) {
            const message = channel.caches.messages.cache.get(d.message_id);

            if (message) {
                message.caches.reactions.cache.clear();
                this.shard.manager.emit('messageReactionRemoveAll', message);
            }
        }
    }
}
