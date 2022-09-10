import { type GatewayMessageCreateDispatch, BaseWebSocketHandler, Message } from '../../../index';

export default class MessageCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageCreateDispatch) {
        const message = new Message(this.shard.manager.client, d);

        this.shard.manager.emit('messageCreate', message);

        if (message.channel) {
            message.channel.caches.messages.cache.set(message.id, message);
        }
    }
}
