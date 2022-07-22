import { BaseWebSocketHandler, GatewayGuildStickersUpdateDispatch, GuildSticker } from '../../..';

export default class GuildStickersUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildStickersUpdate');
    }

    public handle({ d }: GatewayGuildStickersUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id)!;

        const deletions = new Set(guild.caches.stickers.cache.values());

        for (const sticker of d.stickers) {
            const _sticker = guild.caches.stickers.cache.get(sticker.id)!;

            if (_sticker) {
                deletions.delete(_sticker);

                const __sticker =  new GuildSticker(this.shard.manager.client, sticker);

                guild.caches.stickers.cache.set(__sticker.id, __sticker);
                this.shard.manager.client.emit('StickerUpdate', _sticker, __sticker);
            } else {
                const __sticker = new GuildSticker(this.shard.manager.client, sticker);

                guild.caches.stickers.cache.set(__sticker.id, __sticker);
                this.shard.manager.client.emit('StickerCreate', __sticker);
            }
        }

        for (const sticker of deletions) {
            guild.caches.stickers.cache.delete(sticker.id);
            this.shard.manager.client.emit('StickerDelete', sticker);
        }
    }
}
