import { type Client, ChannelInviteManager, GuildBasedChannelResolvable } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class GuildChannelCacheManager extends BaseManager {
    public channel: GuildBasedChannelResolvable;
    public invites: ChannelInviteManager;

    public constructor(client: Client, channel: GuildBasedChannelResolvable) {
        super(client);

        this.channel = channel;

        this.invites = new ChannelInviteManager(client, channel);
    }
}