import {
    type Client,
    type APIGuildTextBasedChannelResolvable,
    type Guild,
    TextChannelCacheManager,
} from '../../index';

import { BaseTextChannel } from './BaseTextChannel';

export class BaseGuildTextChannel extends BaseTextChannel {
    public guild: Guild;
    public caches!: TextChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIGuildTextBasedChannelResolvable) {
        super(client, data);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildTextBasedChannelResolvable) {
        super._patch(data);

        this.caches ??= new TextChannelCacheManager(this.client, this);

        return this;
    }
}
