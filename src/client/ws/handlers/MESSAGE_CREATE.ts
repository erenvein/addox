import { Message } from './../../../structures/Message';
import { type GatewayMessageCreateDispatch, BaseWebSocketHandler } from '../../../index';

export default class MessageCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('MessageCreate');
    }

    public override handle({ d }: GatewayMessageCreateDispatch) {
        const message = new Message(this.shard.manager.client, d);

        message.channel.caches.messages.cache.set(message.id, message);
        this.shard.manager.client.emit('messageCreate', message);
    }
}
