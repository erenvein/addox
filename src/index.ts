// CLIENT
export { BaseClient } from './client/BaseClient';
export { Client } from './client/Client';

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
export { ClientUser } from './structures/ClientUser';
export { UserFlagsBitField } from './structures/UserFlagsBitField';
export { SystemChannelFlagsBitField } from './structures/SystemChannelFlagsBitField';
export { PermissionFlagsBitField } from './structures/PermissionFlagsBitField';
export { Guild } from './structures/Guild';
export { BaseStructure } from './structures/BaseStructure';
export { Oauth2Guild } from './structures/Oauth2Guild';
export { BaseGuild } from './structures/BaseGuild';
export { GuildEmoji } from './structures/GuildEmoji';
export { Role } from './structures/Role';

// MANAGERS
export { CachedManager } from './managers/CachedManager';
export { BaseManager } from './managers/BaseManager';
export { ClientCacheManager } from './managers/client/ClientCacheManager';
export { ClientGuildManager } from './managers/client/ClientGuildManager';
export { ClientUserManager } from './managers/client/ClientUserManager';
export { ClientEmojiManager } from './managers/client/ClientEmojiManager';
export { ClientRoleManager } from './managers/client/ClientRoleManager';
export { GuildEmojiManager } from './managers/guild/GuildEmojiManager';
export { GuildRoleManager } from './managers/guild/GuildRoleManager';
export { GuildCacheManager } from './managers/guild/GuildCacheManager';

// UTILS
export { PresenceDataResolver } from './utils/resolvers/PresenceDataResolver';
export { GatewayIntentBitsResolver } from './utils/resolvers/GatewayIntentBitsResolver';
export { SystemChannelFlagsBitsResolver } from './utils/resolvers/SystemChannelFlagsBitsResolver';
export { GuildMFALevelResolver } from './utils/resolvers/GuildMFALevelResolver';
export { ColorResolver } from './utils/resolvers/ColorResolver';
export { UserFlagsBitsResolver } from './utils/resolvers/UserFlagsBitsResolver';
export { PermissionFlagsBitsResolver } from './utils/resolvers/PermissionFlagsBitsResolver';
export { RoleDataResolver } from './utils/resolvers/RoleDataResolver';
export { Sleep } from './utils/times/Sleep';
export { HexDecimalToHex } from './utils/colors/HexDecimalToHex';
export { HexToHexDecimal } from './utils/colors/HexToHexDecimal';

// SNOWFLAKE UTIL
export { DiscordSnowflake as SnowflakeUtil } from '@sapphire/snowflake';

// TYPES
export * from './Constants';
export * from './Interfaces';

// API TYPES
export * from 'discord-api-types/v10';
