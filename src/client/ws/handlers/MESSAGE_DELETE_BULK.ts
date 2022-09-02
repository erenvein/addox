import {
    type GatewayMessageDeleteBulkDispatch,
    BaseWebSocketHandler,
    type GuildTextBasedChannelResolvable,
    Collection,
    Message,
    Snowflake,
} from '../../../index';

export default class MessageDeleteHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageDeleteBulkDispatch) {
        const guild = this.shard.guilds.get(d.guild_id!);

        if (guild) {
            const channel = guild.caches.channels.cache.get(
                d.channel_id
            ) as GuildTextBasedChannelResolvable;

            if (channel) {
                const messages = new Collection<Snowflake, Message>();

                for (const id of d.ids) {
                    const message = channel.caches.messages.cache.get(id);

                    if (message) {
                        messages.set(id, message);
                    }

                    channel.caches.messages.cache.delete(id);
                }

                if (messages.size > 0) {
                    this.shard.manager.emit('messageDeleteBulk', channel, messages);
                } else {
                    this.shard.manager.emit('messageDeleteBulk', channel, d.ids);
                }
            }
        }
    }
}
