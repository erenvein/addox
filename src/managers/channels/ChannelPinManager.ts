import type { Snowflake, Client, TextBasedChannelResolvable, Message } from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelPinManager extends CachedManager<Snowflake, Message> {
    public channel: TextBasedChannelResolvable;

    public constructor(client: Client, channel: TextBasedChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async create(id: Snowflake, reason?: string) {
        return await this.channel.caches.messages.pin(id, reason);
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.channel.caches.messages.unpin(id, reason);
    }

    public async fetch() {
        return await this.channel.caches.messages.fetchPins();
    }
}
