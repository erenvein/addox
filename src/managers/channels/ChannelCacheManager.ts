import { type Client,type TextBasedChannelResolvable, ChannelMessageManager } from './../../index';

import { BaseManager } from '../BaseManager';

export class ChannelCacheManager extends BaseManager {
    public channel: TextBasedChannelResolvable;
    public messages: ChannelMessageManager

    public constructor(client: Client, channel: TextBasedChannelResolvable) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
    }
}
