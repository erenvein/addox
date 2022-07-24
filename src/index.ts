// CLIENT
export { BaseClient } from './client/BaseClient';
export { Client } from './client/Client';
export { ClientUser } from './client/ClientUser';

// WS
export { WebSocketManager } from './client/ws/WebSocketManager';
export { WebSocketShard } from './client/ws/WebSocketShard';
export { BaseWebSocketEvent } from './client/ws/events/BaseWebSocketEvent';
export { BaseWebSocketHandler } from './client/ws/handlers/BaseWebSocketHandler';
export { DiscordSocketError } from './client/ws/DiscordSocketError';

// REST
export { RequestManager } from './client/rest/RequestManager';
export { HTTPError } from './client/rest/errors/HTTPError';
export { DiscordAPIError } from './client/rest/errors/DiscordAPIError';
export { RateLimitError } from './client/rest/errors/RateLimitError';

// STRUCTURES
export { BitField } from './structures/BitField';
export { Collection } from './structures/Collection';
export { User } from './structures/User';
export { UserFlagsBitField } from './structures/UserFlagsBitField';
export { SystemChannelFlagsBitField } from './structures/SystemChannelFlagsBitField';
export { PermissionFlagsBitField } from './structures/PermissionFlagsBitField';
export { Guild } from './structures/Guild';
export { BaseStructure } from './structures/BaseStructure';
export { Oauth2Guild } from './structures/Oauth2Guild';
export { BaseGuild } from './structures/BaseGuild';
export { GuildEmoji } from './structures/GuildEmoji';
export { Role } from './structures/Role';
export { BaseChannel } from './structures/BaseChannel';
export { GuildWidgetChannel } from './structures/GuildWidgetChannel';
export { GuildWidgetMember } from './structures/GuildWidgetMember';
export { GuildWidgetSettings } from './structures/GuildWidgetSettings';
export { GuildWidget } from './structures/GuildWidget';
export { GuildPreview } from './structures/GuildPreview';
export { GuildWelcomeScreen } from './structures/GuildWelcomeScreen';
export { GuildWelcomeScreenChannel } from './structures/GuildWelcomeScreenChannel';
export { Sticker } from './structures/Sticker';
export { StickerPack } from './structures/StickerPack';
export { UnavailableGuild } from './structures/UnavailableGuild';
export { Presence } from './structures/Presence';
export { PresenceActivity } from './structures/PresenceActivity';
export { PresenceActivityFlagsBitField } from './structures/PresenceActivityFlagsBitField';
export { GuildBan } from './structures/GuildBan';
export { GuildMember } from './structures/GuildMember';

// MANAGERS
export { CachedManager } from './managers/CachedManager';
export { BaseManager } from './managers/BaseManager';
export { ClientCacheManager } from './managers/client/ClientCacheManager';
export { ClientGuildManager } from './managers/client/ClientGuildManager';
export { ClientUserManager } from './managers/client/ClientUserManager';
export { ClientStickerManager } from './managers/client/ClientStickerManager';
export { GuildEmojiManager } from './managers/guild/GuildEmojiManager';
export { GuildRoleManager } from './managers/guild/GuildRoleManager';
export { GuildCacheManager } from './managers/guild/GuildCacheManager';
export { GuildStickerManager } from './managers/guild/GuildStickerManager';
export { GuildBanManager } from './managers/guild/GuildBanManager';
export { GuildMemberManager } from './managers/guild/GuildMemberManager';
export { GuildMemberRoleManager } from './managers/members/GuildMemberRoleManager';

// UTILS
export { PresenceDataResolver } from './utils/resolvers/PresenceDataResolver';
export { PresenceActivityFlagsBitsResolver } from './utils/resolvers/PresenceActivityFlagsBitsResolver';
export { GatewayIntentBitsResolver } from './utils/resolvers/GatewayIntentBitsResolver';
export { SystemChannelFlagsBitsResolver } from './utils/resolvers/SystemChannelFlagsBitsResolver';
export { ColorResolver } from './utils/resolvers/ColorResolver';
export { UserFlagsBitsResolver } from './utils/resolvers/UserFlagsBitsResolver';
export { PermissionFlagsBitsResolver } from './utils/resolvers/PermissionFlagsBitsResolver';
export { RoleDataResolver } from './utils/resolvers/RoleDataResolver';
export { GuildDataResolver } from './utils/resolvers/GuildDataResolver';
export { Sleep } from './utils/times/Sleep';
export { HexDecimalToHex } from './utils/colors/HexDecimalToHex';
export { HexToHexDecimal } from './utils/colors/HexToHexDecimal';
export * as DataResolver from './utils/resolvers/DataResolver';

// SNOWFLAKE UTIL
export { DiscordSnowflake as SnowflakeUtil } from '@sapphire/snowflake';

// TYPES
export * from './Constants';
export * from './Interfaces';

// API TYPES
export * from 'discord-api-types/v10';
