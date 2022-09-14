import {
    Snowflake,
    Client,
    ChannelOverwriteData,
    GuildBasedPermissionOverwritableChannelResolvable,
    CreateChannelOverwriteData,
    PermissionFlagsBitField,
    PermissionFlagsBitsResolver,
    OverwriteType,
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

    public async create(data: CreateChannelOverwriteData, reason?: string) {
        await this.channel.guild.caches.channels.createOverwrite(this.channel.id, data, reason);

        return this.cache._add(data.id, {
            id: data.id,
            type: OverwriteType[data.type] as keyof typeof OverwriteType,
            allow: new PermissionFlagsBitField(
                data.allow ? (PermissionFlagsBitsResolver(data.allow) as number) : 0
            ),
            deny: new PermissionFlagsBitField(
                data.deny ? (PermissionFlagsBitsResolver(data.deny) as number) : 0
            ),
        });
    }

    public async delete(id: Snowflake, reason?: string) {
        this.cache.delete(id);

        return await this.channel.guild.caches.channels.deleteOverwrite(
            this.channel.id,
            id,
            reason
        );
    }

    public async set(permissions: CreateChannelOverwriteData[]) {
        for (const permission of permissions) {
            this.cache.set(permission.id, {
                id: permission.id,
                type: OverwriteType[permission.type] as keyof typeof OverwriteType,
                allow: new PermissionFlagsBitField(
                    permission.allow ? (PermissionFlagsBitsResolver(permission.allow) as number) : 0
                ),
                deny: new PermissionFlagsBitField(
                    permission.deny ? (PermissionFlagsBitsResolver(permission.deny) as number) : 0
                ),
            });
        }

        return (await this.client.caches.channels.edit(this.channel.id, {
            permission_overwrites: permissions,
        })) as GuildBasedPermissionOverwritableChannelResolvable;
    }
}
