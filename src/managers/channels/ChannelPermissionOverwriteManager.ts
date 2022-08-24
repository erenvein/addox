import type {
    Snowflake,
    Client,
    TextBasedChannelResolvable,
    Message,
    ChannelOverwriteData,
    GuildBasedPermissionOverwritableChannelResolvable,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ChannelPermissionOverwriteManager extends CachedManager<
    Snowflake,
    ChannelOverwriteData
> {
    public channel: GuildBasedPermissionOverwritableChannelResolvable;

    public constructor(client: Client, channel: GuildBasedPermissionOverwritableChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async create(data: ChannelOverwriteData, reason?: string) {
        return await this.channel.guild.caches.channels.createOverwrite(
            this.channel.id,
            data,
            reason
        );
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.channel.guild.caches.channels.deleteOverwrite(
            this.channel.id,
            id,
            reason
        );
    }

    public async set(permissions: ChannelOverwriteData[]) {
        return (await this.client.caches.channels.edit(this.channel.id, {
            permission_overwrites: permissions,
        })) as GuildBasedPermissionOverwritableChannelResolvable;
    }
}
