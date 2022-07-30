import { type Client, type DMChannel, ChannelMessageManager } from '../../index';

import { BaseManager } from '../BaseManager';

export class DMChannelCacheManager extends BaseManager {
    public channel: DMChannel;
    public messages: ChannelMessageManager;

    public constructor(client: Client, channel: DMChannel) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
    }
}
