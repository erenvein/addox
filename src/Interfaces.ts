import type {
    GatewayIntentBits,
    Colors,
    PermissionFlagsBits,
    Snowflake,
    GatewayActivityButton,
    GatewayActivityParty,
    GatewayActivityTimestamps,
    GatewayActivitySecrets,
    ActivityType,
    GatewayActivityEmoji,
    ActivityFlags,
    UserFlags,
    GuildMFALevel,
    Client,
    WebSocketShard,
    GatewayCloseCodes,
    APIGuild,
    Collection,
    Guild,
    GatewayDispatchEvents,
    User,
    GuildEmoji,
    GatewayActivityAssets,
    GuildSystemChannelFlags,
    GatewayGuildCreateDispatchData,
    Sticker,
    RESTPostAPIGuildStickerFormDataBody,
    RESTPatchAPIGuildJSONBody,
    GuildExplicitContentFilter,
    GuildDefaultMessageNotifications,
    GuildFeature,
    GuildVerificationLevel,
    RESTPostAPIGuildsJSONBody,
    GatewayPresenceClientStatus,
    Role,
    RESTPatchAPIGuildMemberJSONBody,
    GuildBan,
    Presence,
    GuildMember,
    ChannelFlags,
    MessageActivityType,
    ChannelType,
    VideoQualityMode,
    APITextInputComponent,
    APISelectMenuComponent,
    APIButtonComponent,
    ButtonStyle,
    APISelectMenuOption,
    TextInputStyle,
    ButtonBuilder,
    TextInputBuilder,
    SelectMenuBuilder,
    ApplicationCommandType,
    MessageFlags,
    VoiceChannel,
    DMChannel,
    GroupDMChannel,
    ThreadChannel,
    NewsChannel,
    TextChannel,
    CategoryChannel,
    StageChannel,
    Message,
    ApplicationFlags,
    APITextChannel,
    APIGuildCategoryChannel,
    APINewsChannel,
    APIThreadChannel,
    APIGroupDMChannel,
    APIDMChannel,
    RESTPatchAPIChannelMessageJSONBody,
    APIMessageReference,
    InviteTargetType,
    RESTPostAPIChannelInviteJSONBody,
    APIEmbed,
    EmbedBuilder,
    RESTPostAPIGuildScheduledEventJSONBody,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    RESTPostAPIGuildEmojiJSONBody,
    RESTPatchAPIGuildScheduledEventJSONBody,
    GuildScheduledEventStatus,
    RESTPostAPIStageInstanceJSONBody,
    RESTPatchAPIStageInstanceJSONBody,
    StageInstancePrivacyLevel,
    APIGuildVoiceChannel,
    APIGuildStageVoiceChannel,
    APIAllowedMentions,
    APIActionRowComponent,
    ActionRowBuilder,
    APIAttachment,
    GuildScheduledEvent,
    AutoModerationRuleEventTypes,
    AutoModerationRuleTriggerTypes,
    AutoModerationRuleKeywordPresetTypes,
    AutoModerationRuleActionTypes,
    GuildIntegration,
    ApplicationCommandPermissionType,
    LocalizationMap,
    APIApplicationCommandOptionChoice,
    StageInstance,
    ThreadMember,
    Typing,
    VoiceState,
    MessageReaction,
    Invite,
} from './index';

import type { BodyInit } from 'node-fetch';

export type ArrayLike<T> = T | T[];

export type CollectionLike<K, V> = V | Collection<K, V>;

export interface ClientOptions {
    ws: WebSocketOptions;
    rest?: PartialRequestManagerOptions;
    failIfNotExists?: boolean;
}

export interface WebSocketProperties {
    os?: string;
    browser?: string;
    device?: string;
}

export interface WebSocketOptions {
    largeThreshold?: number;
    presence?: PresenceData;
    shardCount?: number | 'auto';
    compress?: boolean;
    properties?: WebSocketProperties;
    autoReconnect?: boolean;
    intents: GatewayIntentBitsResolvable;
}

export type GatewayIntentBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof GatewayIntentBits>;

export type PermissionFlagsBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof PermissionFlagsBits>;

export type UserFlagsBitsResolvable = ArrayLike<number> | ArrayLike<keyof typeof UserFlags>;

export type ColorResolvable = RGBResolvable | number | `#${string}` | keyof typeof Colors;

export interface RGBResolvable {
    r: number;
    g: number;
    b: number;
}

export type SystemChannelFlagsBitsResolvable =
    | ArrayLike<number>
    | ArrayLike<keyof typeof GuildSystemChannelFlags>;

export type ChannelFlagsBitsResolvable = ArrayLike<number> | ArrayLike<keyof typeof ChannelFlags>;

export interface RequestManagerOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    baseURL: string;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
    baseHeaders?: Record<string, string>;
    agent?: string;
    requestTimeout?: number;
}

export interface FileData {
    name: string;
    data: Buffer | string;
    type?: string;
}

export interface RawFileData {
    key?: string;
    name: string;
    data: Buffer | string;
    type?: string;
}

export type RequestMethods = 'Get' | 'Post' | 'Put' | 'Delete' | 'Patch';

//@ts-ignore
export interface RequestOptions {
    reason?: string;
    files?: RawFileData[];
    appendBodyToFormData?: boolean;
    query?: object;
    headers?: Record<string, string>;
    body?: Record<string, any> | BodyInit;
    agent?: string;
    method?: RequestMethods;
}

export interface PartialRequestManagerOptions {
    offset?: number;
    rejectOnRateLimit?: boolean;
    authPrefix?: 'Bot' | 'Bearer';
    retries?: number;
}

export interface RateLimitData {
    limited: boolean;
    scope?: 'user' | 'shared' | 'global';
    limit?: number;
    remaining?: number;
    reset?: number;
    retry?: number;
    route?: `/${string}`;
}

export interface ImageOptions {
    format?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'json';
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
    dynamic?: boolean;
}

export type PresenceActivityTypeResolvable = keyof typeof ActivityType | number;

export type PresenceActivityFlagsBitsResolvable =
    | ArrayLike<keyof typeof ActivityFlags>
    | ArrayLike<number>;

export interface PresenceActivity {
    name: string;
    type?: PresenceActivityTypeResolvable;
    url?: string;
    created_at?: number;
    timestamps?: GatewayActivityTimestamps[];
    application_id?: Snowflake;
    details?: string;
    state?: string;
    emoji?: GatewayActivityEmoji[];
    party?: GatewayActivityParty[];
    assets?: GatewayActivityAssets[];
    secrets?: GatewayActivitySecrets[];
    instance?: boolean;
    flags?: PresenceActivityFlagsBitsResolvable;
    buttons?: GatewayActivityButton[];
}

export interface PresenceActivitySecrets {
    join?: string;
    spectate?: string;
    match?: string;
}

export interface PresenceActivityAssets {
    largeImage: string | null;
    largeText: string | null;
    smallImage: string | null;
    smallText: string | null;
}

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface PresenceData {
    activities?: PresenceActivity[];
    status?: PresenceStatus;
    afk?: boolean;
    since?: number;
    client_status?: GatewayPresenceClientStatus;
}

export type GatewayCloseCodesResolvable = number | keyof typeof GatewayCloseCodes;

export type WebSocketShardStatus = 'Idle' | 'Ready' | 'Connecting' | 'Reconnecting' | 'Closed';

export interface APIGuildWithShard extends APIGuild {
    shard_id?: number;
}

export interface GatewayGuildCreateDispatchDataWithShard extends GatewayGuildCreateDispatchData {
    shard_id?: number;
}

export interface ClientUserEditData {
    username?: string;
    avatar?: string;
}

export interface FetchGuildOptions extends FetchOptions {
    with_counts?: boolean;
}

export interface FetchBanOptions extends FetchOptions {
    limit?: number;
    before?: Snowflake;
    after?: Snowflake;
}

export interface FetchMemberOptions extends FetchOptions {
    limit?: number;
    after?: Snowflake;
}

export interface FetchOptions {
    force?: boolean;
}

export interface RoleData {
    name?: string;
    permissions?: PermissionFlagsBitsResolvable;
    color?: ColorResolvable;
    hoist?: boolean;
    icon?: string;
    unicode_emoji?: string;
    mentionable?: boolean;
}

export interface RoleTags {
    botId?: string | null;
    integrationId?: string | null;
    premiumSubscriber?: true | null;
}

export type GuildMFALevelResolvable = keyof typeof GuildMFALevel | number;

export interface GuildFetchPruneOptions {
    days?: number;
    includeRoles?: 'none' | Snowflake[];
}

export type ImageMimes = 'image/png' | 'image/jpeg' | 'image/gif';

//@ts-ignore
export interface CreateStickerData extends RESTPostAPIGuildStickerFormDataBody {
    file: Buffer | string;
    description?: string;
}

//@ts-ignore
export interface EditGuildData extends RESTPatchAPIGuildJSONBody {
    explicit_content_filter?: keyof typeof GuildExplicitContentFilter | number;
    default_message_notifications?: keyof typeof GuildDefaultMessageNotifications | number;
    features?: (keyof typeof GuildFeature)[];
    system_channel_flags?: SystemChannelFlagsBitsResolvable;
    verification_level?: keyof typeof GuildVerificationLevel | number;
}

//@ts-ignore
export interface CreateGuildData extends RESTPostAPIGuildsJSONBody {
    explicit_content_filter?: keyof typeof GuildExplicitContentFilter | number;
    default_message_notifications?: keyof typeof GuildDefaultMessageNotifications | number;
    system_channel_flags?: SystemChannelFlagsBitsResolvable;
    verification_level?: keyof typeof GuildVerificationLevel | number;
    roles?: RoleData[];
}

//@ts-ignore
export interface EditGuildMemberData extends RESTPatchAPIGuildMemberJSONBody {
    communication_disabled_until?: number;
}

export interface PresenceClientStatusData {
    desktop?: PresenceStatus;
    mobile?: PresenceStatus;
    web?: PresenceStatus;
}

export interface EditGroupDMChannelData {
    name?: string;
    icon?: Buffer | string;
}

export type ChannelTypeResolvable = keyof typeof ChannelType | number;

export type VoiceQualityModeResolvable = keyof typeof VideoQualityMode | number;

export type ChannelOverwriteTypeResolvable = 'Role' | 'Member' | number;

export interface ChannelOverwriteData {
    id: Snowflake;
    type: ChannelOverwriteTypeResolvable;
    allow?: PermissionFlagsBitsResolvable;
    deny?: PermissionFlagsBitsResolvable;
}

export interface EditGuildChannelData {
    name?: string;
    type?: ChannelTypeResolvable;
    topic?: string;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    position?: number;
    permission_overwrites?: ChannelOverwriteData[];
    parent_id?: Snowflake;
    nsfw?: boolean;
    rtc_region?: string;
    video_quality_mode?: VoiceQualityModeResolvable;
    default_auto_archive_duration?: number;
}

export type EditChannelData = EditGuildChannelData | EditGroupDMChannelData;

export interface CreateGuildChannelData extends EditGuildChannelData {
    type?: ChannelTypeResolvable;
}

export interface MessageActivity {
    type: keyof typeof MessageActivityType;
    partyId: string | null;
}

export type APIAnyComponent =
    | APIButtonComponent
    | APISelectMenuComponent
    | APITextInputComponent
    | APIActionRowComponent<any>;

export type AnyComponent = ButtonBuilder | SelectMenuBuilder | TextInputBuilder | ActionRowBuilder;

export type ButtonStyleResolvable = keyof typeof ButtonStyle | number;

//@ts-ignore
export interface SelectMenuOption extends APISelectMenuOption {
    emoji?: string;
}

export type TextInputStyleResolvable = keyof typeof TextInputStyle | number;

export type MessageFlagsBitsResolvable = keyof typeof MessageFlags | number;

export type TextBasedChannelResolvable =
    | TextChannel
    | DMChannel
    | GroupDMChannel
    | NewsChannel
    | ThreadChannel;

export type TextBasedNonThreadChannelResolvable =
    | TextChannel
    | DMChannel
    | GroupDMChannel
    | NewsChannel;

export type GuildTextBasedNonThreadChannelResolvable = TextChannel | NewsChannel;

export type DMBasedChannelResolvable = DMChannel | GroupDMChannel;

export type GuildTextBasedChannelResolvable = TextChannel | NewsChannel | ThreadChannel;

export type VoiceBasedChannelResolvable = VoiceChannel | StageChannel;

export type GuildBasedChannelResolvable =
    | VoiceBasedChannelResolvable
    | GuildTextBasedChannelResolvable
    | CategoryChannel;

export type GuildBasedNonCategoryChannelResolvable =
    | VoiceBasedChannelResolvable
    | GuildTextBasedChannelResolvable;

export type GuildBasedNonThreadChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | NewsChannel;

export type GuildBasedInvitableChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | NewsChannel;

export type GuildBasedPermissionOverwritableChannelResolvable =
    | VoiceBasedChannelResolvable
    | TextChannel
    | CategoryChannel
    | NewsChannel;

export type AnyChannel = GuildBasedChannelResolvable | DMBasedChannelResolvable;

export type PinnableChannelResolvable = DMBasedChannelResolvable | TextChannel | NewsChannel;

export type MessageableChannelResolvable =
    | DMBasedChannelResolvable
    | GuildTextBasedChannelResolvable
    | VoiceChannel;

export type WebhookableChannelResolvable = TextChannel | NewsChannel | VoiceChannel;

export type APITextBasedChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIThreadChannel
    | APIDMChannel
    | APIGroupDMChannel;

export type APITextBasedNonThreadChannelResolvable =
    | APITextChannel
    | APIDMChannel
    | APIGroupDMChannel
    | APINewsChannel;

export type APIGuildTextBasedNonThreadChannelResolvable = APITextChannel | APINewsChannel;

export type APIDMBasedChannelResolvable = APIDMChannel | APIGroupDMChannel;

export type APIGuildTextBasedChannelResolvable = APITextChannel | APINewsChannel | APIThreadChannel;

export type APIVoiceBasedChannelResolvable = APIGuildVoiceChannel | APIGuildStageVoiceChannel;

export type APIGuildBasedChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable
    | APIGuildCategoryChannel;

export type APIGuildBasedNonCategoryChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable;

export type APIGuildBasedNonThreadChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APINewsChannel;

export type APIGuildBasedInvitableChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APINewsChannel;

export type APIGuildBasedPermissionOverwritableChannelResolvable =
    | APIVoiceBasedChannelResolvable
    | APITextChannel
    | APIGuildCategoryChannel
    | NewsChannel;

export type APIAnyChannel = APIGuildBasedChannelResolvable | APIDMBasedChannelResolvable;

export type APIPinnableChannelResolvable =
    | APIDMBasedChannelResolvable
    | APITextChannel
    | APINewsChannel;

export type APIMessageableChannelResolvable =
    | APIDMBasedChannelResolvable
    | APIGuildTextBasedChannelResolvable
    | APIVoiceBasedChannelResolvable;

export type APIWebhookableChannelResolvable =
    | APITextChannel
    | APINewsChannel
    | APIGuildVoiceChannel;

export interface MessageReactionData {
    count: number;
    me: boolean;
    emoji: string;
}

export interface FetchReactionOptions {
    limit?: number;
    after?: Snowflake;
}

//@ts-ignore
export interface EmbedData extends APIEmbed {
    color?: ColorResolvable;
}

//@ts-ignore
export interface EditMessageData extends RESTPatchAPIChannelMessageJSONBody {
    files?: (Buffer | string)[];
    flags?: MessageFlagsBitsResolvable;
    embeds: (EmbedData | EmbedBuilder)[];
    components?: (APIAnyComponent | AnyComponent)[];
}

//@ts-ignore
export interface CreateMessageData extends EditMessageData {
    message_reference?: MessageReferenceData;
    tts?: boolean;
    stickers?: Snowflake[];
    embeds?: (EmbedData | EmbedBuilder)[];
}

export interface MessageReferenceData extends APIMessageReference {
    fail_if_not_exists?: boolean;
}

export interface EditGuildChannelPositionsData {
    position?: number;
    sync_permissions?: boolean;
    parent_id?: Snowflake;
}

export type ApplicationFlagsBitsResolvable =
    | ArrayLike<keyof typeof ApplicationFlags>
    | ArrayLike<number>;

export type InviteTargetTypeResolvable = keyof typeof InviteTargetType | number;

//@ts-ignore
export interface CreateInviteData extends RESTPostAPIChannelInviteJSONBody {
    target_type?: InviteTargetTypeResolvable;
}

export interface FetchInviteOptions extends FetchOptions {
    with_counts?: boolean;
    with_expiration?: boolean;
    scheduled_event_id?: Snowflake;
}

export interface FetchGuildScheduledEventOptions extends FetchOptions {
    with_user_count?: boolean;
}

export type GuildScheduledEventPrivacyLevelResolvable =
    | keyof typeof GuildScheduledEventPrivacyLevel
    | number;

export type GuildScheduledEventEntityTypeResolvable =
    | keyof typeof GuildScheduledEventEntityType
    | number;

export type GuildScheduledEventStatusResolvable = keyof typeof GuildScheduledEventStatus | number;

//@ts-ignore
export interface CreateGuildScheduledEventData extends RESTPostAPIGuildScheduledEventJSONBody {
    privacy_level?: GuildScheduledEventPrivacyLevelResolvable;
    scheduled_start_time: number;
    scheduled_end_time?: number;
    entity_type: GuildScheduledEventEntityTypeResolvable;
    image?: string | Buffer;
}

//@ts-ignore
export interface EditGuildScheduledEventData extends RESTPatchAPIGuildScheduledEventJSONBody {
    privacy_level?: GuildScheduledEventPrivacyLevelResolvable;
    scheduled_start_time?: number;
    scheduled_end_time?: number;
    entity_type?: GuildScheduledEventEntityTypeResolvable;
    image?: string | Buffer;
    status?: GuildScheduledEventStatusResolvable;
}

//@ts-ignore
export interface CreateEmojiData extends RESTPostAPIGuildEmojiJSONBody {
    image: string | Buffer;
    roles?: Snowflake[];
}

export interface EditEmojiData {
    name?: string;
    roles?: Snowflake[];
}

export interface GuildScheduledEventUserData {
    guildScheduledEventId: Snowflake;
    user: User;
    member: GuildMember | null;
}

export type ReplyMessageOptions = Omit<CreateMessageData, 'message_reference'>;

export type StageInstancePrivacyLevelResolvable = keyof typeof StageInstancePrivacyLevel | number;

//@ts-ignore
export interface CreateStageInstanceData extends RESTPostAPIStageInstanceJSONBody {
    privacy_level?: StageInstancePrivacyLevelResolvable;
}

//@ts-ignore
export interface EditStageInstanceData extends RESTPatchAPIStageInstanceJSONBody {
    privacy_level?: StageInstancePrivacyLevelResolvable;
}

export interface GroupDMAddRecipientData {
    access_token: string;
    nick: string;
}

export interface FetchArchivedThreadOptions {
    before?: number;
    limit?: number;
}

export interface CreateWebhookData {
    name: string;
    avatar?: string | Buffer;
}

export interface EditWebhookData {
    name?: string;
    avatar?: string | Buffer;
    channel_id?: Snowflake;
}

export interface EditWebhookMessageData {
    content?: string;
    embeds?: (EmbedData | EmbedBuilder)[];
    allowed_mentions?: APIAllowedMentions;
    files?: (Buffer | string)[];
    attachments: APIAttachment[];
}

export interface CreateWebhookMessageData extends EditWebhookMessageData {
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    flags?: MessageFlagsBitsResolvable;
    thread_name?: string;
}

export interface CreateWebhookMessageOptions {
    wait?: boolean;
    thread_id?: Snowflake;
}

export interface CreateBanOptions {
    delete_message_days?: number;
    reason?: string;
}

export interface EditGuildMeVoiceStateData {
    channel_id?: Snowflake;
    suppress?: boolean;
    request_to_speak_timestamp?: number;
}

export interface APIAutoModerationRuleTriggerMetadata {
    keyword_filter: string[];
    presets: AutoModerationRuleKeywordPresetTypes[];
    allow_list: string[];
    mention_total_limit: number;
}

export interface AutoModerationRuleTriggerMetadata {
    keywordFilter: string[];
    presets: AutoModerationRuleKeywordPresetTypes[];
    allowList: string[];
    mentionTotalLimit: number;
}

export interface APIAutoModerationRuleActionMetadata {
    channel_id: Snowflake;
    duration_seconds: number;
}

export interface AutoModerationRuleActionMetadata {
    channelId: Snowflake;
    durationSeconds: number;
}

export interface APIAutoModerationRuleActionData {
    type: AutoModerationRuleActionTypes;
    metadata?: APIAutoModerationRuleActionMetadata;
}

export interface AutoModerationRuleActionData {
    type: keyof typeof AutoModerationRuleActionTypes;
    metadata?: AutoModerationRuleActionMetadata | null;
}

export type AutoModerationRuleEventTypeResolvable =
    | keyof typeof AutoModerationRuleEventTypes
    | number;

export interface EditAndCreateAutoModerationRuleData {
    name?: string;
    event_type?: AutoModerationRuleEventTypeResolvable;
    trigger_metadata?: APIAutoModerationRuleTriggerMetadata;
    actions?: APIAutoModerationRuleActionData[];
    enabled?: boolean;
    exempt_roles?: Snowflake[];
    exempt_channels?: Snowflake[];
}

export interface APIAutoModerationRuleData {
    id: Snowflake;
    guild_id: Snowflake;
    name: string;
    creator_id: Snowflake;
    event_type: AutoModerationRuleEventTypes;
    trigger_type: AutoModerationRuleTriggerTypes;
    trigger_metadata: APIAutoModerationRuleTriggerMetadata;
    actions: APIAutoModerationRuleActionData[];
    enabled: boolean;
    exempt_roles: Snowflake[];
    exempt_channels: Snowflake[];
}

export interface ApplicationCommandPermissionsChildData {
    id: Snowflake;
    type: keyof typeof ApplicationCommandPermissionType;
    permission: boolean;
}

//@ts-ignore
export interface APIApplicationCommandPermissionsChildData
    extends ApplicationCommandPermissionsChildData {
    type: ApplicationCommandPermissionType;
}

export interface ApplicationCommandPermissionsData {
    id: Snowflake;
    application_id: Snowflake;
    guild_id: Snowflake;
    permissions: ApplicationCommandPermissionsChildData[];
}

//@ts-ignore
export interface APIApplicationCommandPermissionsData extends ApplicationCommandPermissionsData {
    permissions: APIApplicationCommandPermissionsChildData[];
}

export interface FetchCommandOptions extends FetchOptions {
    with_localizations?: boolean;
}

export interface ApplicationCommandOptionData {
    type: keyof typeof ApplicationCommandType;
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
    options?: ApplicationCommandOptionData[];
    channel_types?: ChannelTypeResolvable[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export interface APIApplicationCommandOptionData {
    type: ApplicationCommandType;
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    required?: boolean;
    choices?: APIApplicationCommandOptionChoice[];
    options?: APIApplicationCommandOptionData[];
    channel_types?: number[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export type ApplicationCommandTypeResolvable = keyof typeof ApplicationCommandType | number;

export type GuildBasedChannelTypes =
    | ChannelType.GuildText
    | ChannelType.GuildVoice
    | ChannelType.GuildCategory
    | ChannelType.GuildNews
    | ChannelType.GuildNewsThread
    | ChannelType.GuildPublicThread
    | ChannelType.GuildPrivateThread
    | ChannelType.GuildStageVoice
    | ChannelType.GuildDirectory
    | ChannelType.GuildForum;

export interface CreateCommandData {
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    options?: ApplicationCommandOptionData[];
    default_member_permissions?: PermissionFlagsBitsResolvable;
    dm_permission?: boolean;
    type?: ApplicationCommandTypeResolvable;
}

export interface APICreateCommandData {
    name: string;
    name_localizations?: LocalizationMap;
    description: string;
    description_localizations?: LocalizationMap;
    options?: APIApplicationCommandOptionData[];
    default_member_permissions?: string;
    dm_permission?: boolean;
    type?: ApplicationCommandType;
}

//@ts-ignore
export interface EditCommandData extends Omit<CreateCommandData, 'type'> {
    name?: string;
    description?: string;
}

export interface WebSocketEvents {
    ready: [client: Client];
    guildCreate: [guild: Guild];
    guildDelete: [guild: Guild];
    guildUpdate: [oldGuild: Guild, newGuild: Guild];
    emojiCreate: [emoji: GuildEmoji];
    emojiDelete: [emoji: GuildEmoji];
    emojiUpdate: [oldEmoji: GuildEmoji, newEmoji: GuildEmoji];
    stickerCreate: [sticker: Sticker];
    stickerDelete: [sticker: Sticker];
    stickerUpdate: [oldSticker: Sticker, newSticker: Sticker];
    roleCreate: [role: Role];
    roleDelete: [role: Role];
    roleUpdate: [oldRole: Role, newRole: Role];
    guildBanAdd: [ban: GuildBan];
    guildBanRemove: [ban: GuildBan];
    presenceUpdate: [oldPresence: Presence, newPresence: Presence];
    guildMemberAdd: [member: GuildMember];
    guildMemberRemove: [member: GuildMember];
    guildMemberUpdate: [oldMember: GuildMember, newMember: GuildMember];
    guildMembersChunk: [
        guild: Guild,
        members: Collection<Snowflake, GuildMember>,
        data: {
            chunkIndex: number | null;
            chunkCount: number | null;
            notFound: unknown[];
            nonce: string | null;
        }
    ];
    messageCreate: [message: Message];
    messageDelete: [message: Message];
    messageUpdate: [oldMessage: Message, newMessage: Message];
    channelCreate: [message: GuildBasedChannelResolvable];
    channelDelete: [message: GuildBasedChannelResolvable];
    channelUpdate: [
        oldChannel: GuildBasedChannelResolvable,
        newChannel: GuildBasedChannelResolvable
    ];
    channelPinsUpdate: [
        channel: GuildTextBasedNonThreadChannelResolvable | DMBasedChannelResolvable,
        data: {
            lastPinTimestamp: number | null;
            lastPinAt: Date | null;
        }
    ];
    scheduledEventCreate: [scheduledEvent: GuildScheduledEvent];
    scheduledEventUserAdd: [scheduledEvent: GuildScheduledEvent, user: User];
    guildScheduledEventUpdate: [
        oldScheduledEvent: GuildScheduledEvent,
        newScheduledEvent: GuildScheduledEvent
    ];
    messageDeleteBulk: [
        channel: GuildTextBasedChannelResolvable,
        messages: Collection<Snowflake, Message> | Snowflake[]
    ];
    integrationUpdate: [oldIntegration: GuildIntegration, newIntegration: GuildIntegration];
    integrationCreate: [integration: GuildIntegration];
    integrationDelete: [integration: GuildIntegration];
    guildIntegrationsUpdate: [guild: Guild];
    messageReactionRemoveAll: [message: Message];
    stageInstanceCreate: [stageInstance: StageInstance];
    stageInstanceDelete: [stageInstance: StageInstance];
    stageInstanceUpdate: [oldStageInstance: StageInstance, newStageInstance: StageInstance];
    threadCreate: [thread: ThreadChannel];
    threadDelete: [thread: ThreadChannel];
    threadMemberUpdate: [thread: ThreadChannel, oldMember: ThreadMember, newMember: ThreadMember];
    threadMemberAdd: [thread: ThreadChannel, member: ThreadMember];
    threadMembersUpdate: [
        thread: ThreadChannel,
        addedMembers: Collection<Snowflake, ThreadMember>,
        removedMembers: Collection<Snowflake, ThreadMember>
    ];
    typingStart: [typing: Typing];
    voiceStateUpdate: [oldState: VoiceState, newState: VoiceState];
    messageReactionAdd: [reaction: MessageReaction];
    messageReactionRemove: [reaction: MessageReaction];
    messageReactionRemoveEmoji: [reaction: MessageReaction];
    userUpdate: [oldUser: User, newUser: User];
    webhooksUpdate: [channel: WebhookableChannelResolvable];
    inviteCreate: [invite: Invite];
    raw: [eventName: keyof typeof GatewayDispatchEvents, data: any];
    shardSpawn: [shard: WebSocketShard];
    shardReady: [shard: WebSocketShard];
    shardClosed: [shard: WebSocketShard, code: number, reason: string];
    shardDeath: [shard: WebSocketShard, code: number, reason: string];
    shardReconnect: [shard: WebSocketShard];
    shardResumed: [shard: WebSocketShard, replayed: number];
    shardError: [shard: WebSocketShard, error: any];
}

export interface WebSocketShardEvents {
    ready: [shard: WebSocketShard];
    close: [shard: WebSocketShard, code: number, reason: string];
    resumed: [shard: WebSocketShard, replayed: number];
    error: [shard: WebSocketShard, error: any];
}
