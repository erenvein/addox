import type { APIThreadChannel, Guild, Client } from '../../index';

import { BaseGuildTextChannel } from './BaseGuildTextChannel';

export class ThreadChannel extends BaseGuildTextChannel {
    public constructor(client: Client, guild: Guild, data: APIThreadChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIThreadChannel) {
        super._patch(data);

        return this;
    }
}
