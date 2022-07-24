import {
    type Client,
    type Snowflake,
    type Guild,
    type CollectionLike,
    type APIBan,
    type FetchBanOptions,
    type RESTPutAPIGuildBanJSONBody,
    GuildBan,
} from '../../index';

import { CachedManager } from '../CachedManager';

export class GuildBanManager extends CachedManager<Snowflake, GuildBan> {
    public guild: Guild;
    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force, limit, before, after }: FetchBanOptions = {
            force: false,
            limit: 1000,
            before: null as unknown as string,
            after: null as unknown as string,
        }
    ): Promise<CollectionLike<Snowflake, GuildBan>> {
        if (id) {
            let _ban = this.cache.get(id)!;

            if (!force && _ban) {
                return _ban;
            } else {
                const ban = await this.client.rest.get<APIBan>(
                    `/guilds/${this.guild.id}/emojis/${id}`
                );

                if (_ban) {
                    _ban = _ban._patch(ban);
                }

                return this.cache._add(
                    ban.user.id!,
                    _ban ?? new GuildBan(this.client, this.guild, ban)
                );
            }
        } else {
            const bans = await this.client.rest.get<APIBan[]>(`/guilds/${this.guild.id}/bans`, {
                query: { limit, before, after },
            });

            this.cache.clear();

            for (const ban of bans) {
                let _ban = this.cache.get(ban.user.id!)!;

                if (_ban) {
                    _ban = _ban._patch(ban);
                }

                this.cache.set(ban.user.id, _ban ?? new GuildBan(this.client, this.guild, ban));
            }

            return this.cache;
        }
    }

    public async create(
        id: Snowflake,
        data: RESTPutAPIGuildBanJSONBody = { delete_message_days: 0 },
        reason?: string
    ) {
        const ban = await this.client.rest.put<APIBan>(`/guilds/${this.guild.id}/bans/${id}`, {
            body: data,
            reason: reason as string,
        });

        return this.cache._add(ban.user.id, new GuildBan(this.client, this.guild, ban));
    }

    public async remove(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/bans/${id}`, { reason: reason as string });
        this.cache.delete(id);
    }
}
