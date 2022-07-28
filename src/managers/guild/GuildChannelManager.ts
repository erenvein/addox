import {
    type GuildBasedChannelResolvable,
    type Snowflake,
    type Guild,
    type Client,
    type CreateGuildChannelData,
    type APIChannel,
    type RESTGetAPIGuildThreadsResult,
    type FetchOptions,
    type EditGuildChannelPositionsData,
    type CollectionLike,
    type ChannelOverwriteData,
    Collection,
    ChannelDataResolver,
    PermissionFlagsBitField,
    OverwriteType,
    Message,
    APIMessage,
} from '../../index';

import { CachedManager } from '../CachedManager';

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannelResolvable> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async create(data: CreateGuildChannelData, reason?: string) {
        const channel = await this.client.rest.post<APIChannel>(
            `/guilds/${this.guild.id}/channels`,
            {
                body: ChannelDataResolver(data),
                reason: reason,
            }
        );

        return this.cache._add(
            channel.id,
            this.client.caches.channels.cache._add(
                channel.id,
                this.client.caches.channels._createChannel(channel) as GuildBasedChannelResolvable
            ) as GuildBasedChannelResolvable
        );
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, GuildBasedChannelResolvable>> {
        if (id) {
            const _role = this.cache.get(id)!;

            if (!force && _role) {
                return _role;
            }

            const channels = (await this.fetch(undefined, {
                force: force as boolean,
            })) as Collection<Snowflake, GuildBasedChannelResolvable>;

            return channels.get(id)!;
        } else {
            const channels = await this.client.rest.get<APIChannel[]>(
                `/guilds/${this.guild.id}/channels`
            );

            const result = new Collection<Snowflake, GuildBasedChannelResolvable>();

            for (const channel of channels) {
                let _channel = this.cache.get(channel.id!)!;

                if (_channel) {
                    _channel = _channel._patch(channel as never);
                }

                result.set(
                    channel.id,
                    this.client.caches.channels.cache._add(
                        channel.id,
                        _channel ??
                            (this.client.caches.channels._createChannel(
                                channel
                            ) as GuildBasedChannelResolvable)
                    ) as GuildBasedChannelResolvable
                );
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async fetchActiveThreads() {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/guilds/${this.guild.id}/threads`
        );

        // TODO
    }

    public async setPosition(id: Snowflake, data: EditGuildChannelPositionsData) {
        await this.client.rest.patch(`/guilds/${this.guild.id}/channels/`, {
            body: {
                id,
                position: data.position,
                lock_permissions: data.sync_permissions,
                parent_id: data.parent_id,
            },
        });
    }

    public async editOverwrite(id: Snowflake, data: ChannelOverwriteData, reason?: string) {
        if ('allow' in data) {
            data.allow = new PermissionFlagsBitField().set(data.allow!);
        }

        if ('deny' in data) {
            data.deny = new PermissionFlagsBitField().set(data.deny!);
        }

        if (typeof data.type === 'string') data.type = OverwriteType[data.type!];

        await this.client.rest.put(`/channels/${id}/permissions/${data.id}`, {
            body: {
                allow: data.allow,
                deny: data.deny,
                type: data.type,
            },
            reason: reason,
        });
    }

    public async createOverwrite(id: Snowflake, data: ChannelOverwriteData, reason?: string) {
        await this.editOverwrite(id, data, reason);
    }

    public async deleteOverwrite(channelId: Snowflake, overwriteId: Snowflake, reason?: string) {
        await this.client.rest.delete(`/channels/${channelId}/permissions/${overwriteId}`, {
            reason: reason,
        });
    }

    public async bulkDelete(channelId: Snowflake, size: number) {
        const _channel = this.cache.get(channelId)!;
        const deletions = new Collection<Snowflake, Message>();

        if (_channel) {
            const messages = await this.client.rest.post<APIMessage[]>(
                `/channels/${channelId}/messages/bulk-delete`,
                {
                    body: {
                        messages: (_channel as any).caches.messages.cache
                            .slice(0, size)
                            .map((message: Message) => message.id),
                    },
                }
            );

            for (const message of messages) {
                const _message = (_channel as any).caches.messages.cache.get(message.id);

                if (_message) {
                    deletions.set(message.id, _message);
                }

                (_channel as any).caches.messages.cache.delete(message.id);
            }

            return deletions;
        } else {
            return null;
        }
    }

    public async fetchInvites() {
        // TODO
    }

    public async createInvite() {
        // TODO
    }

    public async followNewsChannel() {
        // TODO
    }

    public async startThread() {
        // TODO
    }

    public async joinThread() {
        // TODO
    }

    public async leaveThread() {
        // TODO
    }

    public async addThreadMember() {
        // TODO
    }

    public async removeThreadMember() {
        // TODO
    }

    public async fetchThreadMember() {
        // TODO
    }

    public async fetchPublicArchivedThreads() {
        // TODO
    }

    public async fetchPrivateArchivedThreads() {
        // TODO
    }

    public async fetchJoinedThreads() {
        // TODO
    }
}
