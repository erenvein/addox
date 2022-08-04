import type { APIGuildCategoryChannel, Guild, Client } from '../../index';

import { BaseGuildChannel } from '../base/BaseGuildChannel';

export class CategoryChannel extends BaseGuildChannel {
    public constructor(client: Client, guild: Guild, data: APIGuildCategoryChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildCategoryChannel) {
        super._patch(data);

        return this;
    }
}
