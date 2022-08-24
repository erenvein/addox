import {
    APIGuildCategoryChannel,
    Guild,
    Client,
    FetchOptions,
    EditChannelData,
    CategoryChannelCacheManager,
} from '../../index';

import { BaseGuildChannel } from '../base/BaseGuildChannel';

export class CategoryChannel extends BaseGuildChannel {
    public caches!: CategoryChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIGuildCategoryChannel) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildCategoryChannel) {
        super._patch(data);

        this.caches = new CategoryChannelCacheManager(this.client, this);

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as CategoryChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as CategoryChannel;
    }
}
