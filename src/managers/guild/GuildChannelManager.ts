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
    CreateInviteData,
    InviteTargetType,
    APIInvite,
    Invite,
    FetchInviteOptions,
    GuildBasedInvitableChannelResolvable,
    RESTPostAPIChannelFollowersResult,
    FollowedChannel,
    RESTPostAPIChannelThreadsJSONBody,
    APIThreadChannel,
    ThreadChannel,
    ThreadMember,
    APIThreadMember,
    GuildTextBasedChannelResolvable,
    FetchArchivedThreadOptions,
    EditChannelData,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannelResolvable> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async delete(id: Snowflake, reason?: string) {
        return await this.client.caches.channels.delete(id, reason);
    }

    public async edit(id: Snowflake, data: EditChannelData, reason?: string) {
        return (await this.client.caches.channels.edit(
            id,
            data,
            reason
        )) as GuildBasedChannelResolvable;
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
            const _channel = this.cache.get(id)!;

            if (!force && _channel) {
                return _channel;
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

    public async setPosition(id: Snowflake, data: EditGuildChannelPositionsData) {
        return await this.client.rest.patch(`/guilds/${this.guild.id}/channels/`, {
            body: {
                id,
                position: data.position,
                lock_permissions: data.sync_permissions,
                parent_id: data.parent_id,
            },
        });
    }

    public async editOverwrite(
        id: Snowflake,
        data: ChannelOverwriteData,
        reason?: string
    ): Promise<void> {
        if ('allow' in data) {
            data.allow = new PermissionFlagsBitField().set(data.allow!);
        }

        if ('deny' in data) {
            data.deny = new PermissionFlagsBitField().set(data.deny!);
        }

        if (typeof data.type === 'string') data.type = OverwriteType[data.type!];

        return await this.client.rest.put(`/channels/${id}/permissions/${data.id}`, {
            body: {
                allow: data.allow,
                deny: data.deny,
                type: data.type,
            },
            reason: reason,
        });
    }

    public async createOverwrite(id: Snowflake, data: ChannelOverwriteData, reason?: string) {
        return await this.editOverwrite(id, data, reason);
    }

    public async deleteOverwrite(
        channelId: Snowflake,
        overwriteId: Snowflake,
        reason?: string
    ): Promise<void> {
        return await this.client.rest.delete(`/channels/${channelId}/permissions/${overwriteId}`, {
            reason: reason,
        });
    }

    public async bulkDelete(channelId: Snowflake, messages: number | Snowflake[]) {
        const _channel = this.cache.get(channelId)! as GuildTextBasedChannelResolvable;

        let resolved: Snowflake[] = [];

        if (typeof messages === 'number') {
            const _messages = (await _channel!.caches.messages.fetch()) as Collection<
                Snowflake,
                Message
            >;

            resolved = _messages.keyArray().slice(0, messages);
        } else {
            resolved = messages;
        }

        const deletions = new Collection<Snowflake, Message>();

        if (_channel) {
            await this.client.rest.post<APIMessage[]>(
                `/channels/${channelId}/messages/bulk-delete`,
                {
                    body: {
                        messages: resolved,
                    },
                }
            );

            for (const messageId of resolved) {
                const _message = _channel.caches.messages.cache.get(messageId);

                if (_message) {
                    deletions.set(messageId, _message);
                }

                _channel.caches.messages.cache.delete(messageId);
            }
        }

        return deletions;
    }

    public async fetchInvites(
        id: Snowflake,
        code?: string | null,
        { force, with_counts, with_expiration, scheduled_event_id }: FetchInviteOptions = {
            force: false,
        }
    ) {
        const channel = this.cache.get(id)! as GuildBasedInvitableChannelResolvable;

        if (code) {
            let _invite = channel.caches.invites.cache.get(code);

            if (_invite && !force) {
                return _invite;
            } else {
                const invite = await this.client.rest.get<APIInvite>(`/invites/${code}`, {
                    query: {
                        with_counts,
                        with_expiration,
                        guild_scheduled_event_id: scheduled_event_id,
                    },
                });

                if (_invite) {
                    _invite = _invite._patch(invite);
                }

                _invite ??= new Invite(this.client, invite);

                if (channel) {
                    channel.caches.invites.cache.set(code, _invite);
                }

                return _invite;
            }
        } else {
            const invites = await this.client.rest.get<APIInvite[]>(
                `/channels/${channel.id}/invites`
            );

            const result = new Collection<Snowflake, Invite>();

            for (const invite of invites) {
                let _invite = channel.caches.invites.cache.get(invite.code);

                if (_invite) {
                    _invite = _invite._patch(invite);
                }

                result.set(invite.code, _invite ?? new Invite(this.client, invite));
            }

            channel.caches.invites.cache.clear();
            channel.caches.invites.cache.concat(result);

            return result;
        }
    }

    public async createInvite(id: Snowflake, data: CreateInviteData, reason?: string) {
        if (typeof data.target_type === 'string') {
            data.target_type = InviteTargetType[data.target_type];
        }

        const invite = await this.client.rest.post<APIInvite>(`/channels/${id}/invites`, {
            body: reason,
        });

        const _invite = new Invite(this.client, invite);

        const channel = this.cache.get(id);

        if (channel) {
        }

        return _invite;
    }

    public async deleteInvite(code: string, reason?: string) {
        await this.client.rest.delete(`/invites/${code}`, {
            reason,
        });

        this.cache.delete(code);
    }

    public async followNewsChannel(id: Snowflake, webhookId: Snowflake) {
        const data = await this.client.rest.post<RESTPostAPIChannelFollowersResult>(
            `/channels/${id}/followers`,
            {
                body: { webhook_id: webhookId },
            }
        );

        return new FollowedChannel(this.client, data);
    }

    public async startThread(
        channelId: Snowflake,
        data: RESTPostAPIChannelThreadsJSONBody,
        reason?: string | null,
        messageId?: Snowflake
    ) {
        if (messageId) {
            const channel = await this.client.rest.post<APIThreadChannel>(
                `/channels/${channelId}/messages/threads/${messageId}`,
                {
                    body: data,
                    reason: reason as string,
                }
            );

            return this.client.caches.channels.cache._add(
                channel.id,
                this.cache._add(channel.id, new ThreadChannel(this.client, this.guild, channel))
            ) as ThreadChannel;
        } else {
            const channel = await this.client.rest.post<APIThreadChannel>(
                `/channels/${channelId}/threads`,
                {
                    body: data,
                    reason: reason as string,
                }
            );

            return this.client.caches.channels.cache._add(
                channel.id,
                this.cache._add(channel.id, new ThreadChannel(this.client, this.guild, channel))
            ) as ThreadChannel;
        }
    }

    public async joinThread(id: Snowflake) {
        return await this.client.rest.put<void>(`/channels/${id}/thread-members/@me`);
    }

    public async leaveThread(id: Snowflake) {
        return await this.client.rest.delete<void>(`/channels/${id}/thread-members/@me`);
    }

    public async addThreadMember(threadId: Snowflake, userId: Snowflake) {
        return await this.client.rest.put<void>(`/channels/${threadId}/thread-members/${userId}`);
    }

    public async removeThreadMember(threadId: Snowflake, userId: Snowflake) {
        return await this.client.rest.delete<void>(`/channels/${userId}/thread-members/${userId}`);
    }

    public async fetchThreadMembers(
        threadId: Snowflake,
        userId?: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, ThreadMember>> {
        const channel = this.cache.get(threadId) as ThreadChannel;

        if (userId) {
            let _member = channel?.caches.members.cache.get(userId)!;

            if (!force && _member) {
                return _member;
            } else {
                const member = await this.client.rest.get<APIThreadMember>(
                    `/channels/${threadId}/thread-members/${userId}`
                );

                if (_member) {
                    _member = _member._patch(member);
                }

                _member ??= new ThreadMember(this.client, member);

                return channel ? channel.caches.members.cache._add(userId, _member) : _member;
            }
        } else {
            const members = await this.client.rest.get<APIThreadMember[]>(
                `/channels/${threadId}/thread-members`
            );

            const result = new Collection<Snowflake, ThreadMember>();

            for (const member of members) {
                let _member = channel?.caches.members.cache.get(member.id!)!;

                if (_member) {
                    _member = _member._patch(member as never);
                }

                result.set(_member.userId!, _member ?? new ThreadMember(this.client, member));
            }

            channel?.caches.members.cache.clear();
            channel?.caches.members.cache.concat(result);

            return result;
        }
    }

    public async fetchActiveThreads() {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/guilds/${this.guild.id}/threads`
        );

        const _threads = new Collection<Snowflake, ThreadChannel>();
        const _members = new Collection<Snowflake, ThreadMember>();
        const result = new Collection<Snowflake, ThreadChannel>();

        for (const thread of threads.threads) {
            _threads.set(thread.id, new ThreadChannel(this.client, this.guild, thread as any));
        }

        for (const member of threads.members) {
            _members.set(member.user_id!, new ThreadMember(this.client, member));
        }

        for (const thread of _threads.values()) {
            for (const member of _members.values()) {
                if (member.threadId === thread.id) {
                    thread.caches.members.cache.set(member.userId!, member);
                }
            }

            this.client.caches.channels.cache.set(thread.id, thread);
            this.guild.caches.channels.cache.set(thread.id, thread);

            result.set(thread.id, thread);
        }

        return result;
    }

    public async fetchPublicArchivedThreads(
        id: Snowflake,
        { before, limit }: FetchArchivedThreadOptions = {}
    ) {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/guilds/${id}/threads/archived/public`,
            {
                query: {
                    limit,
                    before: before ? new Date(before).toISOString() : undefined,
                },
            }
        );

        const _threads = new Collection<Snowflake, ThreadChannel>();
        const _members = new Collection<Snowflake, ThreadMember>();
        const result = new Collection<Snowflake, ThreadChannel>();

        for (const thread of threads.threads) {
            _threads.set(thread.id, new ThreadChannel(this.client, this.guild, thread as any));
        }

        for (const member of threads.members) {
            _members.set(member.user_id!, new ThreadMember(this.client, member));
        }

        for (const thread of _threads.values()) {
            for (const member of _members.values()) {
                if (member.threadId === thread.id) {
                    thread.caches.members.cache.set(member.userId!, member);
                }
            }

            this.client.caches.channels.cache.set(thread.id, thread);
            this.guild.caches.channels.cache.set(thread.id, thread);

            result.set(thread.id, thread);
        }

        return {
            threads: result,
            //@ts-ignore
            hasMore: threads.has_more,
        };
    }

    public async fetchPrivateArchivedThreads(
        id: Snowflake,
        { before, limit }: FetchArchivedThreadOptions = {}
    ) {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/guilds/${id}/threads/archived/private`,
            {
                query: {
                    limit,
                    before: before ? new Date(before).toISOString() : undefined,
                },
            }
        );

        const _threads = new Collection<Snowflake, ThreadChannel>();
        const _members = new Collection<Snowflake, ThreadMember>();
        const result = new Collection<Snowflake, ThreadChannel>();

        for (const thread of threads.threads) {
            _threads.set(thread.id, new ThreadChannel(this.client, this.guild, thread as any));
        }

        for (const member of threads.members) {
            _members.set(member.user_id!, new ThreadMember(this.client, member));
        }

        for (const thread of _threads.values()) {
            for (const member of _members.values()) {
                if (member.threadId === thread.id) {
                    thread.caches.members.cache.set(member.userId!, member);
                }
            }

            this.client.caches.channels.cache.set(thread.id, thread);
            this.guild.caches.channels.cache.set(thread.id, thread);

            result.set(thread.id, thread);
        }

        return {
            threads: result,
            //@ts-ignore
            hasMore: threads.has_more,
        };
    }

    public async fetchJoinedThreads(
        id: Snowflake,
        { before, limit }: FetchArchivedThreadOptions = {}
    ) {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/channels/${id}/users/@me/threads/archived/private`,
            {
                query: {
                    limit,
                    before: before ? new Date(before).toISOString() : undefined,
                },
            }
        );

        const _threads = new Collection<Snowflake, ThreadChannel>();
        const _members = new Collection<Snowflake, ThreadMember>();
        const result = new Collection<Snowflake, ThreadChannel>();

        for (const thread of threads.threads) {
            _threads.set(thread.id, new ThreadChannel(this.client, this.guild, thread as any));
        }

        for (const member of threads.members) {
            _members.set(member.user_id!, new ThreadMember(this.client, member));
        }

        for (const thread of _threads.values()) {
            for (const member of _members.values()) {
                if (member.threadId === thread.id) {
                    thread.caches.members.cache.set(member.userId!, member);
                }
            }

            this.client.caches.channels.cache.set(thread.id, thread);
            this.guild.caches.channels.cache.set(thread.id, thread);

            result.set(thread.id, thread);
        }

        return {
            threads: result,
            //@ts-ignore
            hasMore: threads.has_more,
        };
    }
}
