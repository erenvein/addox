import {
    type Client,
    GuildEmojiManager,
    type Guild,
    GuildRoleManager,
    GuildStickerManager,
} from '../../';

import { BaseManager } from '../BaseManager';

export class GuildCacheManager extends BaseManager {
    public guild: Guild;
    public emojis: GuildEmojiManager;
    public roles: GuildRoleManager;
    public stickers: GuildStickerManager;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;

        this.emojis = new GuildEmojiManager(client, this.guild);
        this.roles = new GuildRoleManager(client, this.guild);
        this.stickers = new GuildStickerManager(client, this.guild);
    }
}
