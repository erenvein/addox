import {
    type Client,
    type APIGuildForumChannel,
    type Guild,
    ForumChannelCacheManager,
} from '../../index';

import { TextChannel } from './TextChannel';

export class ForumChannel extends TextChannel {
    //@ts-ignore
    public declare caches: ForumChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIGuildForumChannel) {
        //@ts-ignore
        super(client, guild, data);

        this._patch(data);
    }

    //@ts-ignore
    public override _patch(data: APIGuildForumChannel) {
        //@ts-ignore
        super._patch(data);

        this.caches = new ForumChannelCacheManager(this.client, this);

        return this;
    }
}
