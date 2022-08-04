import {
    type Client,
    type APIGuild,
    type CollectionLike,
    type CreateGuildData,
    type Snowflake,
    type RESTAPIPartialCurrentUserGuild,
    type FetchGuildOptions,
    type GuildMFALevelResolvable,
    type GuildFetchPruneOptions,
    type RESTGetAPIGuildPruneCountResult,
    type RESTPostAPIGuildPruneJSONBody,
    type APIVoiceRegion,
    type RESTGetAPIGuildVanityUrlResult,
    type RESTGetAPIGuildWidgetImageResult,
    type RESTGetAPIGuildWidgetSettingsResult,
    type RESTGetAPIGuildWidgetJSONResult,
    type RESTGetAPIGuildPreviewResult,
    type RESTPatchAPIGuildWidgetSettingsJSONBody,
    type RESTPatchAPIGuildWidgetSettingsResult,
    type RESTPatchAPIGuildWelcomeScreenJSONBody,
    type RESTPatchAPIGuildWelcomeScreenResult,
    type RESTGetAPIGuildWelcomeScreenResult,
    GuildWidgetSettings,
    GuildWidget,
    GuildPreview,
    Guild,
    OAuth2Guild,
    GuildWelcomeScreen,
    GuildDataResolver,
    GuildMFALevel,
    EditGuildData,
    UnavailableGuild,
    Collection,
} from '../../index';

import { BaseManager } from '../BaseManager';

export class ClientGuildManager extends BaseManager {
    public unavailables = new Collection<Snowflake, UnavailableGuild>();

    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.ws.guilds;
    }

    public async fetch(
        id?: Snowflake | null,
        { with_counts, force }: FetchGuildOptions = { with_counts: true, force: false }
    ): Promise<CollectionLike<Snowflake, Guild | OAuth2Guild[]>> {
        if (id) {
            let _guild = this.cache.get(id)!;

            if (!force && _guild) {
                return _guild;
            } else {
                const guild = await this.client.rest.get<APIGuild>(`/guilds/${id}`, {
                    query: { with_counts },
                });

                if (_guild) {
                    _guild = _guild._patch(guild);
                }

                return this.cache._add(guild.id, _guild ?? new Guild(this.client, guild));
            }
        } else {
            const guilds = await this.client.rest.get<RESTAPIPartialCurrentUserGuild[]>(
                '/users/@me/guilds'
            );

            return guilds.map((guild) => new OAuth2Guild(this.client, guild));
        }
    }

    public async create(data: CreateGuildData): Promise<Guild> {
        const guild = await this.client.rest.post<APIGuild>('/guilds', {
            body: GuildDataResolver(data),
        });

        return this.cache._add(guild.id, new Guild(this.client, guild));
    }

    public async delete(id: Snowflake) {
        await this.client.rest.delete(`/guilds/${id}`);
        this.cache.delete(id);
    }

    public async leave(id: Snowflake) {
        await this.client.rest.delete(`/users/@me/guilds/${id}`);
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: EditGuildData, reason?: string): Promise<Guild> {
        const guild = await this.client.rest.patch<APIGuild>(`/guilds/${id}`, {
            body: GuildDataResolver(data),
            reason: reason as string,
        });

        let _guild = this.cache.get(id)!;

        if (_guild) {
            _guild = _guild._patch(guild);
        }

        return this.cache._add(guild.id, _guild ?? new Guild(this.client, guild));
    }

    public async setMFALevel(id: Snowflake, level: GuildMFALevelResolvable) {
        await this.client.rest.put(`/guilds/${id}/mfa`, {
            body: {
                level: typeof level === 'number' ? level : GuildMFALevel[level],
            },
        });
    }

    public async fetchPruneCount(
        id: Snowflake,
        { days, includeRoles }: GuildFetchPruneOptions = { days: 7, includeRoles: 'none' }
    ) {
        const { pruned } = await this.client.rest.get<RESTGetAPIGuildPruneCountResult>(
            `/guilds/${id}/prune?days=${days}&include_roles=${
                Array.isArray(includeRoles) ? includeRoles.join(',') : 'none'
            }`
        );

        return pruned;
    }

    public async pruneMembers(
        id: Snowflake,
        { days, include_roles, compute_prune_count }: RESTPostAPIGuildPruneJSONBody = {
            days: 7,
            compute_prune_count: true,
        },
        reason?: string
    ) {
        await this.client.rest.post(`/guilds/${id}/prune`, {
            body: { days, include_roles, compute_prune_count },
            reason: reason as string,
        });
    }

    public async fetchPreview(id: Snowflake) {
        const preview = await this.client.rest.get<RESTGetAPIGuildPreviewResult>(
            `/guilds/${id}/preview`
        );

        return new GuildPreview(this.client, preview);
    }

    public async fetchVoiceRegions(id: Snowflake) {
        return await this.client.rest.get<APIVoiceRegion>(`/guilds/${id}/regions`);
    }

    public async fetchWidgetImage(id: Snowflake) {
        return await this.client.rest.get<RESTGetAPIGuildWidgetImageResult>(
            `/guilds/${id}/widget.png`
        );
    }

    public async fetchWidgetSettings(id: Snowflake) {
        const widgetSettings = await this.client.rest.get<RESTGetAPIGuildWidgetSettingsResult>(
            `/guilds/${id}/widget.json`
        );

        return new GuildWidgetSettings(this.client, id, widgetSettings);
    }

    public async fetchWidget(id: Snowflake) {
        const widget = await this.client.rest.get<RESTGetAPIGuildWidgetJSONResult>(
            `/guilds/${id}/widget`
        );

        return new GuildWidget(this.client, id, widget);
    }

    public async fetchVanityURL(id: Snowflake) {
        return await this.client.rest.get<RESTGetAPIGuildVanityUrlResult>(
            `/guilds/${id}/vanity-url`
        );
    }

    public async fetchWelcomeScreen(id: Snowflake) {
        const welcomeScreen = await this.client.rest.get<RESTGetAPIGuildWelcomeScreenResult>(
            `/guilds/${id}/welcome-screen`
        );

        return new GuildWelcomeScreen(this.client, id, welcomeScreen);
    }

    public async editWidget(
        id: Snowflake,
        data: RESTPatchAPIGuildWidgetSettingsJSONBody,
        reason?: string
    ) {
        const widget = await this.client.rest.patch<RESTPatchAPIGuildWidgetSettingsResult>(
            `/guilds/${id}/widget`,
            {
                body: data,
                reason: reason as string,
            }
        );

        return new GuildWidgetSettings(this.client, id, widget);
    }

    public async editWelcomeScreen(
        id: Snowflake,
        data: RESTPatchAPIGuildWelcomeScreenJSONBody,
        reason?: string
    ) {
        const welcomeScreen = await this.client.rest.patch<RESTPatchAPIGuildWelcomeScreenResult>(
            `/guilds/${id}/welcome-screen`,
            {
                body: data,
                reason: reason as string,
            }
        );

        return new GuildWelcomeScreen(this.client, id, welcomeScreen);
    }
}
