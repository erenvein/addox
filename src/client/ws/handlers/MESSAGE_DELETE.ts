import {
    type GatewayMessageDeleteDispatch,
    BaseWebSocketHandler,
    type GuildTextBasedChannelResolvable,
} from '../../../index';

export default class MessageDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super('MessageDelete');
    }

    public override handle({ d }: GatewayMessageDeleteDispatch) {
        if (d.guild_id) {
            const guild = this.shard.guilds.get(d.guild_id);

            if (guild) {
                const channel = guild.caches.channels.cache.get(
                    d.channel_id
                ) as GuildTextBasedChannelResolvable;

                if (channel) {
                    const message = channel.caches.messages.cache.get(d.id);

                    if (message) {
                        channel.caches.messages.cache.delete(d.id);
                        this.shard.manager.emit('messageDelete', message);
                    }
                }
            }
        } else {
            const channel = this.shard.manager.client.caches.channels.cache.get(
                d.channel_id
            ) as GuildTextBasedChannelResolvable;

            if (channel) {
                const message = channel.caches.messages.cache.get(d.id);

                if (message) {
                    channel.caches.messages.cache.delete(d.id);
                    this.shard.manager.emit('messageDelete', message);
                }
            }
        }
    }
}
