import {
    BaseWebSocketHandler,
    type GatewayMessageUpdateDispatch,
    Message,
    type APIMessage,
} from '../../../index';

export default class MessageUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('MessageUpdate');
    }

    public override handle({ d }: GatewayMessageUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        if (guild) {
            const channel = guild.caches.channels.cache.get(d.channel_id);

            if (channel) {
                let _message = (channel as any).caches.messages.get(d.id);

                if (_message) {
                    const message = _message;

                    _message = _message._patch(d);

                    (channel as any).caches.messages.cache.set(d.id, _message);
                    this.shard.manager.client.emit('messageUpdate', message, _message);
                } else {
                    const message = new Message(this.shard.manager.client, d as APIMessage);

                    (channel as any).caches.messages.cache.set(message.id, message);
                    this.shard.manager.client.emit('messageCreate', message);
                }
            }
        } else {
            const channel = this.shard.manager.client.caches.channels.cache.get(d.channel_id);

            if (channel) {
                let _message = (channel as any).caches.messages.get(d.id);

                if (_message) {
                    const message = _message;

                    _message = _message._patch(d);

                    (channel as any).caches.messages.cache.set(d.id, _message);
                    this.shard.manager.client.emit('messageUpdate', message, _message);
                } else {
                    const message = new Message(this.shard.manager.client, d as APIMessage);

                    (channel as any).caches.messages.cache.set(message.id, message);
                    this.shard.manager.client.emit('messageCreate', message);
                }
            }
        }
    }
}
