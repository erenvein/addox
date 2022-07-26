import type { Message, Snowflake, Client, TextBasedChannelResolvable } from '../../index';

import { CachedManager } from './../CachedManager';

export class ChannelMessageManager extends CachedManager<Snowflake, Message> {
    public channel: TextBasedChannelResolvable;

    public constructor(client: Client, channel: TextBasedChannelResolvable) {
        super(client);

        this.channel = channel;
    }
}
