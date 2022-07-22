import {
    type Client,
    type APIGuild,
    type CollectionLike,
    type RESTPatchAPIGuildJSONBody,
    type RESTPostAPIGuildsJSONBody,
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
    GuildMFALevelResolver,
    GuildWidgetSettings,
    GuildWidget,
    GuildPreview,
    Guild,
    Oauth2Guild,
    GuildWelcomeScreen,
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
                const guild = await this.client.rest.get<APIGuild>(
                    `/guilds/${id}?with_counts=${with_counts ?? true}`
                );

                if (_guild) {
                    _guild = _guild._patch(guild);
                }

                return this.cache._add(guild.id, _guild ?? new Guild(this.client, guild));
            }
        } else {
            const guilds = await this.client.rest.get<RESTAPIPartialCurrentUserGuild[]>('/guilds');

            return guilds.map((guild) => new Oauth2Guild(this.client, guild));
        }
    }

    public async delete(id: Snowflake) {
        await this.client.rest.delete(`/guilds/${id}`);
        this.cache.delete(id);
    }

    public async leave(id: Snowflake) {
        await this.client.rest.delete(`/users/@me/guilds/${id}`);
        this.cache.delete(id);
    }

    public async edit(
        id: Snowflake,
        data: RESTPatchAPIGuildJSONBody,
        reason?: string
    ): Promise<Guild> {
        const guild = await this.client.rest.patch<APIGuild>(`/guilds/${id}`, {
            body: JSON.stringify(data),
            reason: reason,
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

    public async create(data: RESTPostAPIGuildsJSONBody): Promise<Guild> {
        const guild = await this.client.rest.post<APIGuild>('/guilds', {
            body: JSON.stringify(data),
        });

        return this.cache._add(guild.id, new Guild(this.client, guild));
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
            body: JSON.stringify({ days, include_roles, compute_prune_count }),
            reason: reason,
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
                body: JSON.stringify(data),
                reason: reason,
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
                body: JSON.stringify(data),
                reason: reason,
            }
        );

        return new GuildWelcomeScreen(this.client, id, welcomeScreen);
    }
}
