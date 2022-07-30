import {
    type Client,
    type GuildTextBasedChannelResolvable,
    ChannelMessageManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class TextChannelCacheManager extends GuildChannelCacheManager {
    public override channel: GuildTextBasedChannelResolvable;
    public messages: ChannelMessageManager;

    public constructor(client: Client, channel: GuildTextBasedChannelResolvable) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
    }
}
