import {
    type Snowflake,
    type WebSocketShard,
    type GatewayDispatchPayload,
    type AnyChannel,
    type Guild,
    DMChannel,
    GroupDMChannel,
} from '../../../index';

export class BaseWebSocketHandler {
    public shard!: WebSocketShard;

    public handle(packet: GatewayDispatchPayload) {
        throw new ReferenceError('This Method Not Implemented!');
    }

    public addChannelToEveryting(channel: AnyChannel, guild?: Guild) {
        if (!(channel instanceof DMChannel || channel instanceof GroupDMChannel) && guild) {
            guild.caches.channels.cache.set(channel.id, channel);
        }

        return this.shard.manager.client.caches.channels.cache._add(channel.id, channel);
    }

    public removeChannelFromEveryting(id: Snowflake, guild?: Guild) {
        if (guild) {
            guild.caches.channels.cache.delete(id);
        }

        this.shard.manager.client.caches.channels.cache.delete(id);
    }
}
