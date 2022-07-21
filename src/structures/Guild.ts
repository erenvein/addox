import {
    type Client,
    type Snowflake,
    type APIGuildWithShard,
    GuildDefaultMessageNotifications,
    GuildCacheManager,
    type FetchGuildOptions,
    GuildEmoji,
    GuildExplicitContentFilter,
    GuildHubType,
    GuildMFALevel,
    GuildNSFWLevel,
    GuildPremiumTier,
    Role,
    type RESTPatchAPIGuildJSONBody,
    SystemChannelFlagsBitField,
    type GatewayGuildCreateDispatchDataWithShard,
    GuildVerificationLevel,
} from '../';

import { BaseGuild } from './BaseGuild';

export class Guild extends BaseGuild {
    public caches!: GuildCacheManager;
    public shardId!: number | null;
    public afkChannelId!: Snowflake | null;
    public afkTimeout!: number;
    public applicationId!: Snowflake | null;
    public approximateMemberCount!: number | null;
    public approximatePresenceCount!: number | null;
    public banner!: string | null;
    public defaultMessageNotifications!: keyof typeof GuildDefaultMessageNotifications;
    public description!: string | null;
    public discoverySplash!: string | null;
    public explicitContentFilter!: keyof typeof GuildExplicitContentFilter;
    public hubType!: keyof typeof GuildHubType | null;
    public iconHash!: string | null;
    public maxMembers!: number | null;
    public maxPresences!: number | null;
    public maxVideoChannelUsers!: number | null;
    public mfaLevel!: keyof typeof GuildMFALevel;
    public nsfwLevel!: keyof typeof GuildNSFWLevel;
    public ownerId!: Snowflake;
    public preferredLocale!: string;
    public premiumProgressBarEnabled!: boolean;
    public premiumSubscriptionCount!: number;
    public premiumType!: keyof typeof GuildPremiumTier;
    public publicUpdatesChannelId!: Snowflake | null;
    public rulesChannelId!: Snowflake | null;
    public splash!: string | null;
    public systemChannelFlags!: SystemChannelFlagsBitField;
    public systemChannelId!: Snowflake | null;
    public available!: boolean;
    public vanityURLCode!: string | null;
    public verificationLevel!: keyof typeof GuildVerificationLevel;
    public widgetChannelId!: Snowflake | null;
    public widgetEnabled!: boolean;

    public constructor(
        client: Client,
        data: APIGuildWithShard | GatewayGuildCreateDispatchDataWithShard
    ) {
        super(client, data);

        this._patch(data);
    }

    public _patch(data: APIGuildWithShard | GatewayGuildCreateDispatchDataWithShard) {
        super._patch(data);

        this.afkChannelId = data.afk_channel_id;
        this.afkTimeout = data.afk_timeout;
        this.applicationId = data.application_id;
        this.approximateMemberCount = data.approximate_member_count ?? null;
        this.approximatePresenceCount = data.approximate_presence_count ?? null;
        this.banner = data.banner;
        this.defaultMessageNotifications = GuildDefaultMessageNotifications[
            data.default_message_notifications
        ] as keyof typeof GuildDefaultMessageNotifications;
        this.description = data.description;
        this.discoverySplash = data.discovery_splash;
        this.explicitContentFilter = GuildExplicitContentFilter[
            data.explicit_content_filter
        ] as keyof typeof GuildExplicitContentFilter;
        this.hubType = data.hub_type
            ? (GuildHubType[data.hub_type] as keyof typeof GuildHubType)
            : null;
        this.iconHash = data.icon_hash ?? null;
        this.maxMembers = data.max_members ?? null;
        this.maxPresences = data.max_presences ?? null;
        this.maxVideoChannelUsers = data.max_video_channel_users ?? null;
        this.mfaLevel = GuildMFALevel[data.mfa_level] as keyof typeof GuildMFALevel;
        this.nsfwLevel = GuildNSFWLevel[data.nsfw_level] as keyof typeof GuildNSFWLevel;
        this.ownerId = data.owner_id;
        this.preferredLocale = data.preferred_locale;
        this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        this.premiumSubscriptionCount = data.premium_subscription_count ?? 0;
        this.premiumType = GuildPremiumTier[data.premium_tier] as keyof typeof GuildPremiumTier;
        this.publicUpdatesChannelId = data.public_updates_channel_id;
        this.rulesChannelId = data.rules_channel_id;
        this.splash = data.splash;
        this.systemChannelFlags = new SystemChannelFlagsBitField(data.system_channel_flags);
        this.systemChannelId = data.system_channel_id;
        this.available = !data.unavailable;
        this.vanityURLCode = data.vanity_url_code;
        this.verificationLevel = GuildVerificationLevel[
            data.verification_level
        ] as keyof typeof GuildVerificationLevel;
        this.widgetChannelId = data.widget_channel_id ?? null;
        this.widgetEnabled = data.widget_enabled ?? false;

        if ('shard_id' in data) {
            this.shardId = data.shard_id!;
        }

        this.caches = new GuildCacheManager(this.client, this);

        for (const emoji of data.emojis) {
            this.caches.emojis.cache.set(emoji.id!, new GuildEmoji(this.client, this, emoji));
        }

        for (const role of data.roles) {
            this.caches.roles.cache.set(role.id, new Role(this.client, this, role));
        }

        // STICKERS
        // - TODO

        // VOICE STATES
        // - TODO

        // WEBHOOKS
        // - TODO

        // INVITES
        // - TODO

        // BANS
        // - TODO

        // MEMBERS
        // - TODO

        // PRESENCES
        // - TODO

        // WELCOME SCREEN
        // - TODO

        return this;
    }

    public async leave() {
        return await this.client.caches.guilds.delete(this.id);
    }

    public async fetch(options?: FetchGuildOptions): Promise<Guild> {
        return (await this.client.caches.guilds.fetch(this.id, options)) as Guild;
    }

    public async edit(data: RESTPatchAPIGuildJSONBody) {
        return await this.client.caches.guilds.edit(this.id, data);
    }
}
