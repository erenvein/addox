import {
    type Client,
    type TextBasedChannelResolvable,
    ChannelMessageManager,
    ChannelPinManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class TextBasedChannelCacheManager extends BaseManager {
    public channel: TextBasedChannelResolvable;
    public messages: ChannelMessageManager;
    public pins: ChannelPinManager;

    public constructor(client: Client, channel: TextBasedChannelResolvable) {
        super(client);

        this.channel = channel;

        this.messages = new ChannelMessageManager(client, channel);
        this.pins = new ChannelPinManager(client, channel);
    }
}
