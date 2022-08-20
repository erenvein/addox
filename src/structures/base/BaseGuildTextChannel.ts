import {
    type Client,
    type APIGuildTextBasedChannelResolvable,
    type Guild,
    type Snowflake,
    GuildTextBasedChannelCacheManager,
    FetchOptions,
    GuildTextBasedChannelResolvable,
    EditChannelData,
    CreateMessageData,
} from '../../index';

import { BaseGuildChannel } from './BaseGuildChannel';

export class BaseGuildTextChannel extends BaseGuildChannel {
    public caches!: GuildTextBasedChannelCacheManager;
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

        this.caches = new GuildTextBasedChannelCacheManager(this.client, this as any);

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as GuildTextBasedChannelResolvable;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as GuildTextBasedChannelResolvable;
    }

    public async send(data: CreateMessageData) {
        return await this.caches.messages.create(data);
    }
}
