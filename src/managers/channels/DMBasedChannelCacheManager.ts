import { type Client, type DMBasedChannelResolvable, ChannelMessageManager } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class DMBasedChannelCacheManager extends BaseManager {
    public channel: DMBasedChannelResolvable;
    public messages: ChannelMessageManager;

    public constructor(client: Client, channel: DMBasedChannelResolvable) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
    }
}
