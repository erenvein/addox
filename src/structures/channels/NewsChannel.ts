import type { APINewsChannel, Guild, Client } from '../../index';

import { BaseGuildTextChannel } from '../base/BaseGuildTextChannel';

export class NewsChannel extends BaseGuildTextChannel {
    public constructor(client: Client, guild: Guild, data: APINewsChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APINewsChannel) {
        super._patch(data);

        return this;
    }
}
