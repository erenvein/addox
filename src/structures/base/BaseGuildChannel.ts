import {
    type Client,
    type Guild,
    type APIGuildBasedChannelResolvable,
    type FetchOptions,
    type GuildBasedChannelResolvable,
    type Snowflake,
    type CategoryChannel,
    GuildChannelCacheManager,
} from '../../index';

import { BaseChannel } from './BaseChannel';

export class BaseGuildChannel extends BaseChannel {
    public guild: Guild;
    public caches!: GuildChannelCacheManager;
    public parentId!: Snowflake | null;
    public rawPosition!: number;

    public constructor(client: Client, guild: Guild, data: APIGuildBasedChannelResolvable) {
        super(client, data);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: APIGuildBasedChannelResolvable) {
        super._patch(data);

        this.parentId = data.parent_id ?? null;
        this.rawPosition = data.position ?? 0;

        // Permission Overwrites
        // TODO

        this.caches ??= new GuildChannelCacheManager(this.client, this);

        return this;
    }

    public get position() {
        return this.guild.caches.channels.cache.keyArray().indexOf(this.id);
    }

    public get parent() {
        return this.guild.caches.channels.cache.get(this.parentId!) as CategoryChannel | undefined;
    }

    public override async fetch(options?: FetchOptions) {
        return (await this.guild.caches.channels.fetch(
            this.id,
            options
        )) as GuildBasedChannelResolvable;
    }
}
