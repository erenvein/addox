import type {
    Client,
    APIGuildTextBasedChannelResolvable,
    Guild,
    FetchOptions,
    GuildTextBasedChannelResolvable,
    EditChannelData,
    Snowflake,
} from '../../index';

import { BaseGuildChannel } from './BaseGuildChannel';

export class BaseGuildTextChannel extends BaseGuildChannel {
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

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as GuildTextBasedChannelResolvable;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as GuildTextBasedChannelResolvable;
    }

    public async bulkDelete(messages: number | Snowflake[], reason?: string) {
        return await this.guild.caches.channels.bulkDelete(this.id, messages);
    }
}
