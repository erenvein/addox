import {
    GuildSticker,
    type Client,
    type APIStickerPack,
    type Snowflake,
    Collection,
    SnowflakeUtil,
} from '../';

import { BaseStructure } from './BaseStructure';

export class StickerPack extends BaseStructure {
    public bannerAssetId!: Snowflake | null;
    public coverStickerId!: Snowflake | null;
    public description!: string;
    public id!: Snowflake;
    public name!: string;
    public skuId!: Snowflake;
    public stickers!: Collection<Snowflake, GuildSticker>;

    public constructor(client: Client, data: APIStickerPack) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APIStickerPack) {
        this.bannerAssetId = data.banner_asset_id ?? null;
        this.coverStickerId = data.cover_sticker_id ?? null;
        this.description = data.description;
        this.id = data.id;
        this.name = data.name;
        this.skuId = data.sku_id;

        this.stickers = new Collection();

        for (const sticker of data.stickers) {
            this.stickers.set(sticker.id, new GuildSticker(this.client, sticker));
        }

        return this;
    }

    get coverSticker() {
        return this.coverStickerId && this.stickers.get(this.coverStickerId);
    }

    get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public async fetch() {
        return await this.client.caches.stickers.fetchPack();
    }
}
