import {
    type Client,
    type Guild,
    GuildEmojiManager,
    GuildRoleManager,
    GuildStickerManager,
    GuildBanManager,
    GuildMemberManager,
    GuildChannelManager,
} from '../../index';

import { BaseManager } from '../BaseManager';

export class GuildCacheManager extends BaseManager {
    public guild: Guild;
    public emojis: GuildEmojiManager;
    public roles: GuildRoleManager;
    public stickers: GuildStickerManager;
    public bans: GuildBanManager;
    public members: GuildMemberManager;
    public channels: GuildChannelManager;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;

        this.emojis = new GuildEmojiManager(client, guild);
        this.roles = new GuildRoleManager(client, guild);
        this.stickers = new GuildStickerManager(client, guild);
        this.bans = new GuildBanManager(client, guild);
        this.members = new GuildMemberManager(client, guild);
        this.channels = new GuildChannelManager(client, guild);
    }
}
