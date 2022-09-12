import {
    type Client,
    type GuildTextBasedNonThreadChannelResolvable,
    ChannelMessageManager,
    ChannelPinManager,
    ChannelThreadManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class GuildTextBasedChannelCacheManager extends GuildChannelCacheManager {
    public declare channel: GuildTextBasedNonThreadChannelResolvable;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;
    public threads: ChannelThreadManager;

    public constructor(client: Client, channel: GuildTextBasedNonThreadChannelResolvable) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
        this.threads = new ChannelThreadManager(client, channel);
    }
}
