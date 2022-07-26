import type {
    Client,
    Guild,
    APIGuildBasedChannelResolvable,
    FetchOptions,
    GuildBasedChannelResolvable,
} from '../index';

import { BaseChannel } from './BaseChannel';

export class BaseGuildChannel extends BaseChannel {
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIGuildBasedChannelResolvable) {
        super(client, data);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildBasedChannelResolvable) {
        super._patch(data);

        return this;
    }

    public get position() {
        return this.guild.caches.channels.cache.keyArray().indexOf(this.id);
    }

    public override async fetch(options?: FetchOptions) {
        return (await this.guild.caches.channels.fetch(
            this.id,
            options
        )) as GuildBasedChannelResolvable;
    }
}
