import { Message } from '../../../structures/channels/Message';
import { type GatewayMessageCreateDispatch, BaseWebSocketHandler } from '../../../index';

export default class MessageCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('MessageCreate');
    }

    public override handle({ d }: GatewayMessageCreateDispatch) {
        const message = new Message(this.shard.manager.client, d);

        this.shard.manager.emit('messageCreate', message);

        if (message.channel) {
            message.channel.caches.messages.cache.set(message.id, message);
        }
    }
}
