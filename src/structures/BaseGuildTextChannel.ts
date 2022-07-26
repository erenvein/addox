import type { Client, APIGuildTextBasedChannelResolvable, Snowflake, Guild } from '../index';

import { BaseGuildChannel } from './BaseGuildChannel';

export class BaseGuildTextChannel extends BaseGuildChannel {
    public lastMessageId!: Snowflake | null;

    public constructor(client: Client, guild: Guild, data: APIGuildTextBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildTextBasedChannelResolvable) {
        super._patch(data);

        this.lastMessageId = data.last_message_id ?? null;

        return this;
    }
}
