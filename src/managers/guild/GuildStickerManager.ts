import {
    type Client,
    GuildSticker,
    type Snowflake,
    type Guild,
    type CollectionLike,
    type APISticker,
    type FetchOptions,
    type RESTPostAPIGuildStickerFormDataBody,
    type RESTPatchAPIGuildStickerJSONBody,
    DataResolver,
} from '../../';

import { fromBuffer } from 'file-type';
import FormData from 'form-data';
import { Blob } from 'node:buffer';

import { CachedManager } from '../CachedManager';

export class GuildStickerManager extends CachedManager<Snowflake, GuildSticker> {
    public guild: Guild;
    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, GuildSticker>> {
        if (id) {
            let _sticker = this.cache.get(id)!;

            if (!force && _sticker) {
                return _sticker;
            } else {
                const sticker = await this.client.rest.get<APISticker>(
                    `/guilds/${this.guild.id}/stickers/${id}`
                );

                if (_sticker) {
                    _sticker = _sticker._patch(sticker);
                }

                return this.cache._add(
                    sticker.id!,
                    _sticker ?? new GuildSticker(this.client, sticker)
                );
            }
        } else {
            const stickers = await this.client.rest.get<APISticker[]>(
                `/guilds/${this.guild.id}/stickers`
            );

            for (const sticker of stickers) {
                let _sticker = this.cache.get(sticker.id!);

                if (_sticker) {
                    _sticker = _sticker._patch(sticker);
                }

                this.cache.set(sticker.id!, _sticker ?? new GuildSticker(this.client, sticker));
            }

            return this.cache;
        }
    }

    public async create(data: RESTPostAPIGuildStickerFormDataBody, reason?: string) {
        const body = new FormData();

        data.file = DataResolver.resolveImage(data.file as string);

        const fileType = await fromBuffer(data.file as Buffer);

        body.append('description', data.description);
        body.append('file', new Blob([data.file as Buffer], { type: fileType?.mime }), {
            filename: data.name,
        });
        body.append('name', data.name);
        body.append('tags', data.tags);

        const sticker = await this.client.rest.post<APISticker>(
            `/guilds/${this.guild.id}/stickers`,
            {
                body,
                reason: reason,
            }
        );

        return this.cache._add(sticker.id!, new GuildSticker(this.client, sticker));
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/stickers/${id}`, {
            reason: reason,
        });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: RESTPatchAPIGuildStickerJSONBody, reason?: string) {
        const sticker = await this.client.rest.patch<APISticker>(
            `/guilds/${this.guild.id}/stickers/${id}`,
            { body: JSON.stringify(data), reason: reason }
        );

        let _sticker = this.cache.get(id);

        if (_sticker) {
            _sticker = _sticker._patch(sticker);
        }

        return this.cache._add(sticker.id!, _sticker ?? new GuildSticker(this.client, sticker));
    }
}
