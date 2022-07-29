import { Client, APITextBasedChannelResolvable, Snowflake, ChannelCacheManager } from '../index';

import { BaseChannel } from './BaseChannel';

export class BaseTextChannel extends BaseChannel {
    public lastMessageId!: Snowflake | null;
    public caches!: ChannelCacheManager;

    public constructor(client: Client, data: APITextBasedChannelResolvable) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APITextBasedChannelResolvable) {
        super._patch(data);

        this.caches ??= new ChannelCacheManager(this.client, this);

        this.lastMessageId = data.last_message_id ?? null;

        return this;
    }
}
