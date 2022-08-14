import {
    type Client,
    type APIGuildTextBasedChannelResolvable,
    type Guild,
    type Snowflake,
    type CreateMessageData,
    GuildTextBasedChannelCacheManager,
} from '../../index';

import { BaseGuildChannel } from './BaseGuildChannel';

export class BaseGuildTextChannel extends BaseGuildChannel {
    public declare caches: GuildTextBasedChannelCacheManager;
    public nsfw!: boolean;
    public lastMessageId!: Snowflake | null;

    public constructor(client: Client, guild: Guild, data: APIGuildTextBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildTextBasedChannelResolvable) {
        super._patch(data);

        this.lastMessageId = data.last_message_id ?? null;
        this.nsfw = data.nsfw ?? false;

        this.caches = new GuildTextBasedChannelCacheManager(this.client, this);

        return this;
    }

    public get lastMessage() {
        return this.caches.messages.cache.get(this.lastMessageId!);
    }

    public async send(data: CreateMessageData) {
        return this.caches.messages.create(data);
    }
}
