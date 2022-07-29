import type { Client, APIGuildTextBasedChannelResolvable, Guild } from '../index';

import { BaseTextChannel } from './BaseTextChannel';

export class BaseGuildTextChannel extends BaseTextChannel {
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildTextBasedChannelResolvable) {
        super(client, data);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildTextBasedChannelResolvable) {
        super._patch(data);

        return this;
    }
}
