import type { APIGuildTextBasedChannelResolvable, Guild, Client } from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class TextChannel extends BaseGuildTextChannel {
    public constructor(client: Client, guild: Guild, data: APIGuildTextBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildTextBasedChannelResolvable) {
        super._patch(data);

        return this;
    }
}
