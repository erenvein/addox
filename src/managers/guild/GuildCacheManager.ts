import {
    type Client,
    type Guild,
    GuildEmojiManager,
    GuildRoleManager,
    GuildStickerManager,
    GuildBanManager,
    GuildMemberManager,
} from '../../';

import { BaseManager } from '../BaseManager';

export class GuildCacheManager extends BaseManager {
    public guild: Guild;
    public emojis: GuildEmojiManager;
    public roles: GuildRoleManager;
    public stickers: GuildStickerManager;
    public bans: GuildBanManager;
    public members: GuildMemberManager;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;

        this.emojis = new GuildEmojiManager(client, this.guild);
        this.roles = new GuildRoleManager(client, this.guild);
        this.stickers = new GuildStickerManager(client, this.guild);
        this.bans = new GuildBanManager(client, this.guild);
        this.members = new GuildMemberManager(client, this.guild);
    }
}
