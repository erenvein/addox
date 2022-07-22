import { GuildSticker, type Client, Collection, type Snowflake } from '../..';

import { BaseManager } from '../BaseManager';

export class ClientStickerManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.stickers.cache),
            new Collection<Snowflake, GuildSticker>()
        );
    }
}
