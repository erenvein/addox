import type { Client, APITextChannel } from '../index';

import { BaseTextChannel } from './BaseTextChannel';

export class GuildTextChannel extends BaseTextChannel {
    public constructor(client: Client, data: APITextChannel) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APITextChannel) {
        super._patch(data);

        return this;
    }
}
