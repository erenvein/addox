import {
    type Client,
    type VoiceBasedChannelResolvable,
    ChannelMessageManager,
} from '../../index';

import { GuildChannelCacheManager } from './GuildChannelCacheManager';

export class VoiceBasedChannelCacheManager extends GuildChannelCacheManager {
    public override channel: VoiceBasedChannelResolvable;
    public messages: ChannelMessageManager;

    public constructor(client: Client, channel: VoiceBasedChannelResolvable) {
        super(client, channel);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
    }
}
