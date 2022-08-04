// #CLIENT
export { BaseClient } from './client/BaseClient';
export { Client } from './client/Client';
export { ClientUser } from './client/ClientUser';

// - WS
export { WebSocketManager } from './client/ws/WebSocketManager';
export { WebSocketShard } from './client/ws/WebSocketShard';
export { BaseWebSocketEvent } from './client/ws/events/BaseWebSocketEvent';
export { BaseWebSocketHandler } from './client/ws/handlers/BaseWebSocketHandler';
export { DiscordSocketError } from './client/ws/DiscordSocketError';

// - REST
export { RequestManager } from './client/rest/RequestManager';
export { HTTPError } from './client/rest/errors/HTTPError';
export { DiscordAPIError } from './client/rest/errors/DiscordAPIError';
export { RateLimitError } from './client/rest/errors/RateLimitError';

// #BUILDERS
export { BaseBuilder } from './builders/BaseBuilder';
export { ActionRowBuilder } from './builders/ActionRowBuilder';
export { ButtonBuilder } from './builders/ButtonBuilder';
export { TextInputBuilder } from './builders/TextInputBuilder';
export { SelectMenuBuilder } from './builders/SelectMenuBuilder';
export { EmbedBuilder } from './builders/EmbedBuilder';

// #MANAGERS

// -BASE
export { CachedManager } from './managers/base/CachedManager';
export { BaseManager } from './managers/base/BaseManager';

// - CLIENT
export { ClientCacheManager } from './managers/client/ClientCacheManager';
export { ClientGuildManager } from './managers/client/ClientGuildManager';
export { ClientUserManager } from './managers/client/ClientUserManager';
export { ClientStickerManager } from './managers/client/ClientStickerManager';
export { ClientChannelManager } from './managers/client/ClientChannelManager';
export { ClientStageInstanceManager } from './managers/client/ClientStageInstanceManager';

// - GUILD
export { GuildEmojiManager } from './managers/guild/GuildEmojiManager';
export { GuildRoleManager } from './managers/guild/GuildRoleManager';
export { GuildCacheManager } from './managers/guild/GuildCacheManager';
export { GuildStickerManager } from './managers/guild/GuildStickerManager';
export { GuildBanManager } from './managers/guild/GuildBanManager';
export { GuildMemberManager } from './managers/guild/GuildMemberManager';
export { GuildChannelManager } from './managers/guild/GuildChannelManager';
export { GuildScheduledEventManager } from './managers/guild/GuildScheduledEventManager';

// - MESSAGES
export { MessageMentionManager } from './managers/messages/MessageMentionManager';
export { MessageReactionManager } from './managers/messages/MessageReactionManager';
export { MessageCacheManager } from './managers/messages/MessageCacheManager';

// - CHANNELS
export { ChannelMessageManager } from './managers/channels/ChannelMessageManager';
export { DMChannelCacheManager } from './managers/channels/DMChannelCacheManager';
export { ChannelInviteManager } from './managers/channels/ChannelInviteManager';
export { GuildChannelCacheManager } from './managers/channels/GuildChannelCacheManager';
export { TextChannelCacheManager } from './managers/channels/TextChannelCacheManager';
export { GroupDMChannelRecipientManager } from './managers/channels/GroupDMChannelRecipientManager';

// - MEMBERS
export { GuildMemberCacheManager } from './managers/members/GuildMemberCacheManager';
export { GuildMemberRoleManager } from './managers/members/GuildMemberRoleManager';

// #STRUCTURES

// - BASE
export { BitField } from './structures/base/BitField';
export { Collection } from './structures/base/Collection';
export { BaseChannel } from './structures/base/BaseChannel';
export { BaseStructure } from './structures/base/BaseStructure';
export { BaseGuild } from './structures/base/BaseGuild';

// - BITFIELD
export { ThreadMemberFlagsBitField } from './structures/bitfield/ThreadMemberFlagsBitField';
export { UserFlagsBitField } from './structures/bitfield/UserFlagsBitfield';
export { SystemChannelFlagsBitField } from './structures/bitfield/SystemChannelFlagsBitField';
export { PermissionFlagsBitField } from './structures/bitfield/PermissionFlagsBitField';
export { PresenceActivityFlagsBitField } from './structures/bitfield/PresenceActivityFlagsBitField';
export { ChannelFlagsBitField } from './structures/bitfield/ChannelFlagsBitField';
export { MessageFlagsBitField } from './structures/bitfield/MessageFlagsBitField';
export { ApplicationFlagsBitField } from './structures/bitfield/ApplicationFlagsBitField';

// - GUILD
export { Guild } from './structures/guild/Guild';
export { GuildEmoji } from './structures/guild/GuildEmoji';
export { Role } from './structures/guild/Role';
export { OAuth2Guild } from './structures/guild/OAuth2Guild';
export { GuildWidgetChannel } from './structures/guild/GuildWidgetChannel';
export { GuildWidgetMember } from './structures/guild/GuildWidgetMember';
export { GuildWidgetSettings } from './structures/guild/GuildWidgetSettings';
export { GuildWidget } from './structures/guild/GuildWidget';
export { GuildPreview } from './structures/guild/GuildPreview';
export { GuildWelcomeScreen } from './structures/guild/GuildWelcomeScreen';
export { GuildWelcomeScreenChannel } from './structures/guild/GuildWelcomeScreenChannel';
export { UnavailableGuild } from './structures/guild/UnavailableGuild';
export { GuildBan } from './structures/guild/GuildBan';
export { GuildMember } from './structures/guild/GuildMember';
export { GuildScheduledEvent } from './structures/guild/GuildScheduledEvent';

// - INVITES
export { Invite } from './structures/invites/Invite';
export { InviteApplication } from './structures/invites/InviteApplication';
export { InviteGuild } from './structures/invites/InviteGuild';

// - ANY
export { Sticker } from './structures/Sticker';
export { StickerPack } from './structures/StickerPack';
export { Presence } from './structures/Presence';
export { User } from './structures/User';
export { PresenceActivity } from './structures/PresenceActivity';
export { BaseGuildChannel } from './structures/base/BaseGuildChannel';
export { BaseTextChannel } from './structures/base/BaseTextChannel';
export { DMChannel } from './structures/channels/DMChannel';
export { GuildTextChannel } from './structures/channels/GuildTextChannel';
export { Attachment } from './structures/Attachment';
export { Message } from './structures/channels/Message';
export { MessageInteraction } from './structures/channels/MessageInteraction';
export { GroupDMChannel } from './structures/channels/GroupDMChannel';
export { ThreadMember } from './structures/channels/ThreadMember';
export { BaseGuildTextChannel } from './structures/base/BaseGuildTextChannel';
export { CategoryChannel } from './structures/channels/CategoryChannel';
export { VoiceChannel } from './structures/channels/VoiceChannel';
export { TextChannel } from './structures/channels/TextChannel';
export { ThreadChannel } from './structures/channels/ThreadChannel';
export { NewsChannel } from './structures/channels/NewsChannel';
export { StageChannel } from './structures/channels/StageChannel';
export { Team } from './structures/Team';
export { TeamMember } from './structures/TeamMember';
export { MessageReference } from './structures/channels/MessageReference';
export { StageInstance } from './structures/StageInstance';

// #UTILS

// - RESOLVERS
export { PresenceDataResolver } from './utils/resolvers/PresenceDataResolver';
export { PresenceActivityFlagsBitsResolver } from './utils/resolvers/PresenceActivityFlagsBitsResolver';
export { GatewayIntentBitsResolver } from './utils/resolvers/GatewayIntentBitsResolver';
export { SystemChannelFlagsBitsResolver } from './utils/resolvers/SystemChannelFlagsBitsResolver';
export { ColorResolver } from './utils/resolvers/ColorResolver';
export { UserFlagsBitsResolver } from './utils/resolvers/UserFlagsBitsResolver';
export { PermissionFlagsBitsResolver } from './utils/resolvers/PermissionFlagsBitsResolver';
export { GuildDataResolver } from './utils/resolvers/GuildDataResolver';
export { ChannelFlagsBitsResolver } from './utils/resolvers/ChannelFlagsBitsResolver';
export { DataResolver } from './utils/resolvers/DataResolver';
export { MessageFlagsBitsResolver } from './utils/resolvers/MessageFlagsBitsResolver';
export { ApplicationFlagsBitsResolver } from './utils/resolvers/ApplicationFlagsBitsResolver';
export { GuildScheduledEventDataResolver } from './utils/resolvers/GuildScheduledEventDataResolver';
export * from './utils/resolvers/EmojiResolver';
export * from './utils/resolvers/RoleDataResolver';
export * from './utils/resolvers/ChannelDataResolver';

// - TIMES
export { Sleep } from './utils/times/Sleep';

// - COLORS
export { HexDecimalToHex } from './utils/colors/HexDecimalToHex';
export { HexToHexDecimal } from './utils/colors/HexToHexDecimal';

// - BASE
export * from './utils/Base';

// #SNOWFLAKE UTIL
export { DiscordSnowflake as SnowflakeUtil } from '@sapphire/snowflake';

// #TYPES
export * from './Constants';
export * from './Interfaces';

// #API TYPES
export * from 'discord-api-types/v10';
