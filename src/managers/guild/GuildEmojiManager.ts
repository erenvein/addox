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
    DataResolver,
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
                const emoji = await this.client.rest.get<APIEmoji>(
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
            const emojis = await this.client.rest.get<APIEmoji[]>(
                `/guilds/${this.guild.id}/emojis`
            );

            this.cache.clear();

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

    public async create(data: RESTPostAPIGuildEmojiJSONBody, reason?: string) {
        const resolvedImage = await DataResolver.resolveImage(data.image as string, 'image/jpeg');

        data.image = resolvedImage;

        const emoji = await this.client.rest.post<APIEmoji>(`/guilds/${this.guild.id}/emojis`, {
            body: data,
            reason: reason,
        });

        return this.cache._add(emoji.id!, new GuildEmoji(this.client, this.guild, emoji));
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/emojis/${id}`, { reason: reason });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: RESTPatchAPIGuildEmojiJSONBody, reason?: string) {
        const emoji = await this.client.rest.patch<APIEmoji>(
            `/guilds/${this.guild.id}/emojis/${id}`,
            { body: data, reason: reason }
        );

        let _emoji = this.cache.get(id);

        if (_emoji) {
            _emoji = _emoji._patch(emoji);
        }

        return this.cache._add(emoji.id!, _emoji ?? new GuildEmoji(this.client, this.guild, emoji));
    }
}
