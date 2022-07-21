import { BaseWebSocketHandler, GatewayGuildEmojisUpdateDispatch, GuildEmoji } from '../../..';

export default class GuildEmojisUpdateHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildEmojisUpdate');
    }

    public handle({ d }: GatewayGuildEmojisUpdateDispatch) {
        const guild = this.shard.guilds.get(d.guild_id)!;

        const deletions = new Set(d.emojis);

        for (const emoji of d.emojis) {
            const _emoji = guild.caches.emojis.cache.get(emoji.id!);

            if (_emoji) {
                deletions.delete(emoji);

                const __emoji = new GuildEmoji(this.shard.manager.client, guild, emoji);

                guild.caches.emojis.cache.set(__emoji.id!, __emoji);

                this.shard.manager.client.emit('EmojiUpdate', _emoji, __emoji);
            } else {
                const __emoji = new GuildEmoji(this.shard.manager.client, guild, emoji);

                guild.caches.emojis.cache.set(__emoji.id!, __emoji);

                this.shard.manager.client.emit('EmojiCreate', __emoji);
            }
        }

        for (const emoji of deletions) {
            const _emoji = guild.caches.emojis.cache.get(emoji.id!);

            if (_emoji) {
                guild.caches.emojis.cache.delete(_emoji.id!);

                this.shard.manager.client.emit('EmojiDelete', _emoji);
            }
        }
    }
}
