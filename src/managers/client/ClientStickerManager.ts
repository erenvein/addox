import {
    Sticker,
    type Client,
    Collection,
    type Snowflake,
    APIStickerPack,
    StickerPack,
    type CollectionLike,
} from '../..';

import { BaseManager } from '../BaseManager';

export class ClientStickerManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.stickers.cache),
            new Collection<Snowflake, Sticker>()
        );
    }

    public async fetchPack(id?: Snowflake): Promise<CollectionLike<Snowflake, StickerPack>> {
        const packs = await this.client.rest.get<APIStickerPack[]>(`/sticker-packs`);
        const collection = new Collection<Snowflake, StickerPack>();

        for (const pack of packs) {
            collection.set(pack.id, new StickerPack(this.client, pack));
        }

        if (id) {
            return collection.get(id)!;
        }

        return collection;
    }
}
