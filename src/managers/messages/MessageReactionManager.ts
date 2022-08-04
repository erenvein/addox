import {
    type Client,
    type Snowflake,
    type MessageReaction,
    type APIReaction,
    type APIPartialEmoji,
    type Message,
    type FetchReactionOptions,
    type APIUser,
    EmojiResolver,
    User,
    Collection,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class MessageReactionManager extends CachedManager<Snowflake, MessageReaction> {
    public message: Message;

    public constructor(client: Client, message: Message, reactions: APIReaction[]) {
        super(client);

        for (const reaction of reactions) {
            if (reaction.emoji.id) {
                this.cache.set(reaction.emoji.id, {
                    count: reaction.count,
                    me: reaction.me,
                    emoji: EmojiResolver(reaction.emoji) as string,
                });
            }
        }

        this.message = message;
    }

    public async fetchUsers(emoji: string, { after, limit }: FetchReactionOptions = { limit: 25 }) {
        const resolved = EmojiResolver(emoji) as APIPartialEmoji;

        const users = await this.client.rest.get<APIUser[]>(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${resolved.name}:${resolved.id}`,
            {
                query: {
                    limit,
                    after,
                },
            }
        );

        const result = new Collection<Snowflake, User>();

        for (const user of users) {
            result.set(user.id, new User(this.client, user));
        }

        this.client.caches.users.cache.concat(result);

        return result;
    }

    public async create(emoji: string) {
        const resolved = EmojiResolver(emoji) as APIPartialEmoji;

        await this.client.rest.post(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${resolved.name}:${resolved.id}/@me`
        );
    }

    public async delete(emoji: string, userId?: Snowflake) {
        const resolved = EmojiResolver(emoji) as APIPartialEmoji;

        await this.client.rest.delete(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${
                resolved.name
            }:${resolved.id}/${userId ?? '@me'}`
        );
    }

    public async deleteAll() {
        await this.client.rest.delete(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions`
        );
    }

    public async deleteAllForEmoji(emoji: string) {
        const resolved = EmojiResolver(emoji) as APIPartialEmoji;

        await this.client.rest.delete(
            `/channels/${this.message.channelId}/messages/${this.message.id}/reactions/${resolved.name}:${resolved.id}`
        );
    }
}
