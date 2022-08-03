import {
    type Client,
    type Snowflake,
    type APIGuildWithShard,
    type ImageOptions,
    type GuildFetchPruneOptions,
    type RESTPostAPIGuildPruneJSONBody,
    type RESTPatchAPIGuildWidgetSettingsJSONBody,
    type RESTPatchAPIGuildWelcomeScreenJSONBody,
    type GuildBasedChannelResolvable,
    type EditGuildData,
    type GatewayGuildCreateDispatchDataWithShard,
    GuildDefaultMessageNotifications,
    GuildCacheManager,
    GuildEmoji,
    GuildExplicitContentFilter,
    GuildHubType,
    GuildMFALevel,
    GuildNSFWLevel,
    GuildPremiumTier,
    Role,
    SystemChannelFlagsBitField,
    GuildVerificationLevel,
    Sticker,
    Presence,
    GuildMember,
    User,
} from '../../index';

import { BaseGuild } from '../channels/BaseGuild';

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
    public maximumMembers!: number | null;
    public maximumPresences!: number | null;
    public maximumVideoChannelUsers!: number | null;
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
    public memberCount!: number;
    public large!: boolean;
    public joinedAt!: Date;

    public constructor(
        client: Client,
        data: APIGuildWithShard | GatewayGuildCreateDispatchDataWithShard
    ) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIGuildWithShard | GatewayGuildCreateDispatchDataWithShard) {
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
        this.maximumMembers = data.max_members ?? null;
        this.maximumPresences = data.max_presences ?? null;
        this.maximumVideoChannelUsers = data.max_video_channel_users ?? null;
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
        this.vanityURLCode = data.vanity_url_code;
        this.verificationLevel = GuildVerificationLevel[
            data.verification_level
        ] as keyof typeof GuildVerificationLevel;
        this.widgetChannelId = data.widget_channel_id ?? null;
        this.widgetEnabled = data.widget_enabled ?? false;

        if ('unavailable' in data) {
            this.available = !data.unavailable;
        } else {
            this.available = true;
        }

        if ('shard_id' in data) {
            this.shardId = data.shard_id ?? null;
        } else {
            this.shardId ??= null;
        }

        if ('member_count' in data) {
            this.memberCount = data.member_count;
        } else {
            this.memberCount ??= 0;
        }

        if ('large' in data) {
            this.large = data.large;
        } else {
            this.large ??= false;
        }

        if ('joined_at' in data) {
            this.joinedAt = new Date(Date.parse(data.joined_at));
        } else {
            this.joinedAt ??= new Date();
        }

        this.caches ??= new GuildCacheManager(this.client, this);

        if ('emojis' in data) {
            for (const emoji of data.emojis) {
                this.caches.emojis.cache.set(emoji.id!, new GuildEmoji(this.client, this, emoji));
            }
        }

        if ('roles' in data) {
            for (const role of data.roles) {
                this.caches.roles.cache.set(role.id!, new Role(this.client, this, role));
            }
        }

        if ('stickers' in data) {
            for (const sticker of data.stickers) {
                this.caches.stickers.cache.set(sticker.id!, new Sticker(this.client, sticker));
            }
        }

        if ('presences' in data) {
            for (const presence of data.presences) {
                this.caches.presences.set(
                    presence.user.id,
                    new Presence(this.client, Object.assign(presence, { guild_id: this.id }))
                );
            }
        }

        if ('members' in data) {
            for (const member of data.members) {
                if (member.user) {
                    this.client.caches.users.cache.set(
                        member.user.id,
                        new User(this.client, member.user)
                    );
                }

                this.caches.members.cache.set(
                    member.user?.id!,
                    new GuildMember(this.client, this, member)
                );
            }
        }

        if ('channels' in data) {
            for (const channel of data.channels) {
                this.caches.channels.cache.set(
                    channel.id,
                    this.client.caches.channels.cache._add(
                        channel.id,
                        this.client.caches.channels._createChannel(
                            channel
                        ) as GuildBasedChannelResolvable
                    ) as GuildBasedChannelResolvable
                );
            }
        }

        // STAGE INSTANCES
        // - TODO

        // INVITES
        // - TODO

        // INTEGRATIONS
        // - TODO

        // GUILD SCHEDULED EVENTS
        // - TODO

        // VOICE STATES
        // - TODO

        // WELCOME SCREEN
        // - TODO

        // THREADS
        // - TODO

        // WEBHOOKS
        // - TODO

        return this;
    }

    public get owner() {
        return this.caches.members.cache.get(this.ownerId);
    }

    public get afkChannel() {
        return this.caches.channels.cache.get(this.afkChannelId!);
    }

    public get systemChannel() {
        return this.caches.channels.cache.get(this.systemChannelId!);
    }

    public get publicUpdatesChannel() {
        return this.caches.channels.cache.get(this.publicUpdatesChannelId!);
    }

    public get rulesChannel() {
        return this.caches.channels.cache.get(this.rulesChannelId!);
    }

    public get widgetChannel() {
        return this.caches.channels.cache.get(this.widgetChannelId!);
    }

    public splashURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.splash
            ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.${
                  dynamic && this.splash.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public discoverySplashURL(
        { dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }
    ) {
        return this.discoverySplash
            ? `https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discoverySplash}.${
                  dynamic && this.discoverySplash.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public get shard() {
        return this.client.ws.shards.get(this.shardId!);
    }

    public get joinedTimestamp() {
        return this.joinedAt.getTime();
    }

    public async leave() {
        return await this.client.caches.guilds.leave(this.id);
    }

    public async edit(data: EditGuildData, reason?: string) {
        return await this.client.caches.guilds.edit(this.id, data, reason);
    }

    public async fetchOwner() {
        return (await this.caches.members.fetch(this.ownerId)) as GuildMember;
    }

    public async fetchPruneCount(options?: GuildFetchPruneOptions) {
        return await this.client.caches.guilds.fetchPruneCount(this.id, options);
    }

    public async pruneMembers(options?: RESTPostAPIGuildPruneJSONBody) {
        return await this.client.caches.guilds.pruneMembers(this.id, options);
    }

    public async fetchPreview() {
        return await this.client.caches.guilds.fetchPreview(this.id);
    }

    public async fetchVoiceRegions() {
        return await this.client.caches.guilds.fetchVoiceRegions(this.id);
    }

    public async fetchWidgetImage() {
        return await this.client.caches.guilds.fetchWidgetImage(this.id);
    }

    public async fetchWidgetSettings() {
        return await this.client.caches.guilds.fetchWidgetSettings(this.id);
    }

    public async fetchWidget() {
        return await this.client.caches.guilds.fetchWidget(this.id);
    }

    public async fetchVanityURL() {
        return await this.client.caches.guilds.fetchVanityURL(this.id);
    }

    public async fetchWelcomeScreen() {
        return await this.client.caches.guilds.fetchWelcomeScreen(this.id);
    }

    public async editWidget(data: RESTPatchAPIGuildWidgetSettingsJSONBody, reason?: string) {
        return await this.client.caches.guilds.editWidget(this.id, data, reason);
    }

    public async editWelcomeScreen(data: RESTPatchAPIGuildWelcomeScreenJSONBody, reason?: string) {
        return await this.client.caches.guilds.editWelcomeScreen(this.id, data, reason);
    }
}
