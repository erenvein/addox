import {
    type Client,
    type GuildTextBasedChannelResolvable,
    ChannelMessageManager,
    ChannelPinManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class GuildTextBasedChannelCacheManager extends GuildChannelCacheManager {
    public override channel: GuildTextBasedChannelResolvable;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;

    public constructor(client: Client, channel: GuildTextBasedChannelResolvable) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
    }
}
