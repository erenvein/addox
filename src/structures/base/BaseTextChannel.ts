import {
    Client,
    APITextBasedChannelResolvable,
    Snowflake,
    TextBasedChannelCacheManager,
    CreateMessageData,
} from '../../index';

import { BaseChannel } from './BaseChannel';

export class BaseTextChannel extends BaseChannel {
    public lastMessageId!: Snowflake | null;
    public caches!: TextBasedChannelCacheManager;

    public constructor(client: Client, data: APITextBasedChannelResolvable) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APITextBasedChannelResolvable) {
        super._patch(data);

        this.lastMessageId = data.last_message_id ?? null;

        this.caches = new TextBasedChannelCacheManager(this.client, this as any);

        return this;
    }

    public async send(data: CreateMessageData) {
        return await this.caches.messages.create(data);
    }
}
