import { GuildEmoji, type Client, Collection, type Snowflake } from '../..';

import { BaseManager } from '../BaseManager';

export class ClientEmojiManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.emojis.cache),
            new Collection<Snowflake, GuildEmoji>()
        );
    }
}
