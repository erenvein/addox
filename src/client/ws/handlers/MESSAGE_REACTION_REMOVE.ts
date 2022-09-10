import {
    type GatewayMessageReactionRemoveDispatch,
    BaseWebSocketHandler,
    MessageReaction,
    MessageableChannelResolvable,
} from '../../../index';

export default class MessageReactionRemoveHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveDispatch) {
        const channel = this.shard.manager.client.caches.channels.cache.get(
            d.channel_id
        ) as MessageableChannelResolvable;

        if (channel) {
            const message = channel?.caches.messages.cache.get(d.message_id);

            if (message) {
                message.caches.reactions.cache.delete(d.emoji.id!);
            }
        }

        this.shard.manager.emit(
            'messageReactionRemove',
            new MessageReaction(this.shard.manager.client, d)
        );
    }
}
