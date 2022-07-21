import {
    Guild,
    Oauth2Guild,
    type Client,
    type APIGuild,
    type CollectionLike,
    type RESTPatchAPIGuildJSONBody,
    type RESTPostAPIGuildsJSONBody,
    type Snowflake,
    type RESTAPIPartialCurrentUserGuild,
    type FetchGuildOptions,
    GuildMFALevelResolver,
    type GuildMFALevelResolvable,
    type GuildFetchPruneOptions,
    type RESTGetAPIGuildPruneCountResult,
} from '../..';

import { BaseManager } from '../BaseManager';

export class ClientGuildManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.ws.guilds;
    }

    public async fetch(
        id?: Snowflake | null,
        { with_counts, force }: FetchGuildOptions = { with_counts: true, force: false }
    ): Promise<CollectionLike<Snowflake, Guild | Oauth2Guild[]>> {
        if (id) {
            let _guild = this.cache.get(id)!;

            if (!force && _guild) {
                return _guild;
            } else {
                const guild: APIGuild = await this.client.rest.get(
                    `/guilds/${id}?with_counts=${with_counts ?? true}`
                );

                if (_guild) {
                    _guild = _guild._patch(guild);
                }

                return this.cache._add(guild.id, _guild ?? new Guild(this.client, guild));
            }
        } else {
            const guilds: RESTAPIPartialCurrentUserGuild[] = await this.client.rest.get('/guilds');

            return guilds.map((guild) => new Oauth2Guild(this.client, guild));
        }
    }

    public async delete(id: Snowflake) {
        await this.client.rest.delete(`/users/@me/guilds/${id}`);
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: RESTPatchAPIGuildJSONBody): Promise<Guild> {
        const guild: APIGuild = await this.client.rest.patch(`/guilds/${id}`, {
            body: JSON.stringify(data),
        });

        let _guild = this.cache.get(id)!;

        if (_guild) {
            _guild = _guild._patch(guild);
        }

        return _guild ?? new Guild(this.client, guild);
    }

    public async setMFALevel(id: Snowflake, level: GuildMFALevelResolvable) {
        await this.client.rest.put(`/guilds/${id}/mfa`, {
            body: JSON.stringify({ level: GuildMFALevelResolver(level) }),
        });
    }

    public async fetchPruneCount(
        id: Snowflake,
        { days, includeRoles }: GuildFetchPruneOptions = { days: 7, includeRoles: 'none' }
    ) {
        const { pruned }: RESTGetAPIGuildPruneCountResult = await this.client.rest.get(
            `/guilds/${id}/prune?days=${days}&include_roles=${
                Array.isArray(includeRoles) ? includeRoles.join(',') : 'none'
            }`
        );

        return pruned;
    }

    public async create(data: RESTPostAPIGuildsJSONBody): Promise<Guild> {
        const guild: APIGuild = await this.client.rest.post('/guilds', {
            body: JSON.stringify(data),
        });

        return this.cache._add(guild.id, new Guild(this.client, guild));
    }

    // TODO
}
