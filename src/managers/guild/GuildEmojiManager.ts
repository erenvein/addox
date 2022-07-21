import {
    type Client,
    GuildEmoji,
    type Snowflake,
    type Guild,
    type CollectionLike,
    type APIEmoji,
    type FetchOptions,
    type RESTPostAPIGuildEmojiJSONBody,
    type RESTPatchAPIGuildEmojiJSONBody,
} from '../../';

import { CachedManager } from '../CachedManager';

export class GuildEmojiManager extends CachedManager<Snowflake, GuildEmoji> {
    public guild: Guild;
    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, GuildEmoji>> {
        if (id) {
            let _emoji = this.cache.get(id)!;

            if (!force && _emoji) {
                return _emoji;
            } else {
                const emoji: APIEmoji = await this.client.rest.get(
                    `/guilds/${this.guild.id}/emojis/${id}`
                );

                if (_emoji) {
                    _emoji = _emoji._patch(emoji);
                }

                return this.cache._add(
                    emoji.id!,
                    _emoji ?? new GuildEmoji(this.client, this.guild, emoji)
                );
            }
        } else {
            const emojis: APIEmoji[] = await this.client.rest.get(
                `/guilds/${this.guild.id}/emojis`
            );

            for (const emoji of emojis) {
                let _emoji = this.cache.get(emoji.id!);

                if (_emoji) {
                    _emoji = _emoji._patch(emoji);
                }

                this.cache.set(emoji.id!, _emoji ?? new GuildEmoji(this.client, this.guild, emoji));
            }

            return this.cache;
        }
    }

    public async create(data: RESTPostAPIGuildEmojiJSONBody) {
        const emoji: APIEmoji = await this.client.rest.post(`/guilds/${this.guild.id}/emojis`, {
            body: JSON.stringify(data),
        });

        return this.cache._add(emoji.id!, new GuildEmoji(this.client, this.guild, emoji));
    }

    public async delete(id: Snowflake) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/emojis/${id}`);
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: RESTPatchAPIGuildEmojiJSONBody) {
        const emoji: APIEmoji = await this.client.rest.patch(
            `/guilds/${this.guild.id}/emojis/${id}`,
            { body: JSON.stringify(data) }
        );

        let _emoji = this.cache.get(id);

        if (_emoji) {
            _emoji = _emoji._patch(emoji);
        }

        return this.cache._add(emoji.id!, _emoji ?? new GuildEmoji(this.client, this.guild, emoji));
    }
}
