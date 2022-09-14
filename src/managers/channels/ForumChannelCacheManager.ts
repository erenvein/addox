import {
    type Client,
    ForumChannel,
    ChannelMessageManager,
    ChannelPinManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class ForumChannelCacheManager extends GuildChannelCacheManager {
    public declare channel: ForumChannel;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;

    public constructor(client: Client, channel: ForumChannel) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
    }
}
