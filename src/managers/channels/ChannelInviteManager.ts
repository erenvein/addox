import {
    type Snowflake,
    type Client,
    type GuildBasedChannelResolvable,
    type CreateInviteData,
    type APIInvite,
    type FetchInviteOptions,
    InviteTargetType,
    Invite,
    Collection,
} from '../../index';

import { CachedManager } from '../CachedManager';

export class ChannelInviteManager extends CachedManager<Snowflake, Invite> {
    public channel: GuildBasedChannelResolvable;

    public constructor(client: Client, channel: GuildBasedChannelResolvable) {
        super(client);

        this.channel = channel;
    }

    public async create(data: CreateInviteData, reason?: string) {
        if (typeof data.target_type === 'string') {
            data.target_type = InviteTargetType[data.target_type];
        }

        const invite = await this.client.rest.post<APIInvite>(
            `/channels/${this.channel.id}/invites`,
            { body: reason }
        );

        return this.cache._add(invite.code, new Invite(this.client, invite));
    }

    public async fetch(
        code?: string,
        { force, with_counts, with_expiration, scheduled_event_id }: FetchInviteOptions = {
            force: false,
        }
    ) {
        if (code) {
            let _invite = this.cache.get(code);

            if (_invite && !force) {
                return this.cache.get(code);
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

                return this.cache._add(invite.code, _invite ?? new Invite(this.client, invite));
            }
        } else {
            const invites = await this.client.rest.get<APIInvite[]>(
                `/channels/${this.channel.id}/invites`
            );

            const result = new Collection<Snowflake, Invite>();

            for (const invite of invites) {
                let _invite = this.cache.get(invite.code!);

                if (_invite) {
                    _invite = _invite._patch(invite);
                }

                this.cache.set(invite.code!, _invite ?? new Invite(this.client, invite));
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async delete(code: string, reason?: string) {
        await this.client.rest.delete(`/invites/${code}`, {
            reason,
        });

        this.cache.delete(code);
    }
}
