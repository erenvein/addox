import {
    type Client,
    type Snowflake,
    type Guild,
    type CollectionLike,
    type APISticker,
    type FetchOptions,
    type CreateStickerData,
    type RESTPatchAPIGuildStickerJSONBody,
    DataResolver,
    Sticker,
} from '../../';

import { createReadStream } from 'node:fs';

import { CachedManager } from '../CachedManager';

export class GuildStickerManager extends CachedManager<Snowflake, Sticker> {
    public guild: Guild;
    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, Sticker>> {
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

                return this.cache._add(sticker.id!, _sticker ?? new Sticker(this.client, sticker));
            }
        } else {
            const stickers = await this.client.rest.get<APISticker[]>(
                `/guilds/${this.guild.id}/stickers`
            );

            this.cache.clear();

            for (const sticker of stickers) {
                let _sticker = this.cache.get(sticker.id!);

                if (_sticker) {
                    _sticker = _sticker._patch(sticker);
                }

                this.cache.set(sticker.id!, _sticker ?? new Sticker(this.client, sticker));
            }

            return this.cache;
        }
    }

    public async create(data: CreateStickerData, reason?: string) {
        const resolvedFile = await DataResolver.resolveFile(data.file);

        data.description ??= '';
        data.tags ??= '';

        const sticker = await this.client.rest.post<APISticker>(
            `/guilds/${this.guild.id}/stickers`,
            {
                body: {
                    name: data.name,
                    description: data.description,
                    tags: data.tags,
                },
                reason: reason,
                files: [
                    {
                        key: 'file',
                        name: resolvedFile.name,
                        data: resolvedFile.data,
                        type: resolvedFile.type,
                    },
                ],
                appendBodyToFormData: true,
            }
        );

        return this.cache._add(sticker.id!, new Sticker(this.client, sticker));
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
            { body: data, reason: reason }
        );

        let _sticker = this.cache.get(id);

        if (_sticker) {
            _sticker = _sticker._patch(sticker);
        }

        return this.cache._add(sticker.id!, _sticker ?? new Sticker(this.client, sticker));
    }
}
