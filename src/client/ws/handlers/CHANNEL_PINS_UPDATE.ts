import {
    BaseWebSocketHandler,
    DMBasedChannelResolvable,
    GatewayChannelPinsUpdateDispatch,
    GuildTextBasedNonThreadChannelResolvable,
} from '../../../index';

export default class ChannelUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayChannelPinsUpdateDispatch) {
        //@ts-ignore
        const guild = this.shard.guilds.get(d.guild_id);

        console.log(d);

        if (guild) {
            const channel = guild.caches.channels.cache.get(
                d.channel_id
            ) as GuildTextBasedNonThreadChannelResolvable;

            if (d.last_pin_timestamp) {
                channel.lastPinTimestamp = new Date(d.last_pin_timestamp).getTime();

                if (channel) {
                    this.shard.manager.emit('channelPinsUpdate', channel, {
                        lastPinTimestamp: channel.lastPinTimestamp,
                        lastPinAt: channel.lastPinTimestamp
                            ? new Date(channel.lastPinTimestamp)
                            : null,
                    });
                }
            }
        } else {
            const channel = this.shard.manager.client.caches.channels.cache.get(
                d.channel_id
            ) as DMBasedChannelResolvable;

            if (d.last_pin_timestamp) {
                channel.lastPinTimestamp = new Date(d.last_pin_timestamp).getTime();

                if (channel) {
                    this.shard.manager.emit('channelPinsUpdate', channel, {
                        lastPinTimestamp: channel.lastPinTimestamp,
                        lastPinAt: channel.lastPinTimestamp
                            ? new Date(channel.lastPinTimestamp)
                            : null,
                    });
                }
            }
        }
    }
}
