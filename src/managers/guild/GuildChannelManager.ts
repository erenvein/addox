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
} from '../../index';

import { CachedManager } from '../base/CachedManager';

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
