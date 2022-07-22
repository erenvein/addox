import {
    type APISticker,
    type Client,
    type Snowflake,
    type FetchOptions,
    type RESTPatchAPIGuildStickerJSONBody,
    StickerType,
    StickerFormatType,
    User,
} from '..';

import { BaseStructure } from './BaseStructure';

export class GuildSticker extends BaseStructure {
    public id!: Snowflake;
    public packId!: Snowflake | null;
    public name!: string;
    public description!: string | null;
    public tags!: string;
    public type!: keyof typeof StickerType;
    public formatType!: keyof typeof StickerFormatType;
    public available!: boolean;
    public guildId!: Snowflake | null;
    public author!: User | null;
    public sortValue!: number | null;

    public constructor(client: Client, data: APISticker) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APISticker) {
        this.id = data.id;
        this.packId = data.pack_id ?? null;
        this.name = data.name;
        this.description = data.description ?? null;
        this.tags = data.tags;
        this.type = StickerType[data.type] as keyof typeof StickerType;
        this.formatType = StickerFormatType[data.format_type] as keyof typeof StickerFormatType;
        this.available = data.available ?? true;
        this.guildId = data.guild_id ?? null;
        this.author = data.user ? new User(this.client, data.user) : null;
        this.sortValue = data.sort_value ?? null;

        return this;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public async edit(data: RESTPatchAPIGuildStickerJSONBody) {
        return this.guild?.caches.stickers.edit(this.id, data);
    }

    public async fetch(options?: FetchOptions) {
        return this.guild?.caches.stickers.fetch(this.id, options) as unknown as GuildSticker;
    }

    public async delete(reason?: string) {
        return this.guild?.caches.stickers.delete(this.id, reason);
    }
}
