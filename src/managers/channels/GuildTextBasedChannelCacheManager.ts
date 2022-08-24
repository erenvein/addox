import {
    type Client,
    type GuildTextBasedNonThreadChannelResolvable,
    ChannelMessageManager,
    ChannelPinManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class GuildTextBasedChannelCacheManager extends GuildChannelCacheManager {
    public override channel: GuildTextBasedNonThreadChannelResolvable;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;

    public constructor(client: Client, channel: GuildTextBasedNonThreadChannelResolvable) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
    }
}
