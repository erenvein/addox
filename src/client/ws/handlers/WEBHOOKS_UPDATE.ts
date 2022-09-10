import {
    type GatewayWebhooksUpdateDispatch,
    BaseWebSocketHandler,
    WebhookableChannelResolvable,
} from '../../../index';

export default class TypingStartHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayWebhooksUpdateDispatch) {
        const channel = this.shard.manager.client.caches.channels.cache.get(
            d.channel_id
        ) as WebhookableChannelResolvable;

        if (channel) {
            this.shard.manager.emit('webhooksUpdate', channel);
        }
    }
}
