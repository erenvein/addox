import {
    type Snowflake,
    type Client,
    type APIChannel,
    type EditChannelData,
    type APIMessage,
    type AnyChannel,
    type EditMessageData,
    type CreateMessageData,
    type CollectionLike,
    ChannelType,
    DMChannel,
    type FetchOptions,
    ChannelDataResolver,
    DataResolver,
    MessageFlagsBitsResolver,
    MessageFlagsBitField,
    deleteProperty,
    Collection,
    ColorResolver,
    Message,
} from '../../index';

import { CachedManager } from '../CachedManager';

export class ClientChannelManager extends CachedManager<Snowflake, AnyChannel> {
    public constructor(client: Client) {
        super(client);
    }

    public _createChannel(data: APIChannel): AnyChannel | null {
        let channel = null;

        switch (data.type) {
            case ChannelType.DM:
                channel = new DMChannel(this.client, data);
                break;
            case ChannelType.GroupDM:
                break;
            case ChannelType.GuildCategory:
                break;
            case ChannelType.GuildForum:
                break;
            case ChannelType.GuildNews:
                break;
            case ChannelType.GuildNewsThread:
            case ChannelType.GuildPrivateThread:
            case ChannelType.GuildPublicThread:
                break;
            case ChannelType.GuildStageVoice:
                break;
            case ChannelType.GuildText:
                break;
            case ChannelType.GuildVoice:
                break;
        }

        return channel;
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/channels/${id}`, { reason: reason as string });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: EditChannelData, reason?: string): Promise<AnyChannel> {
        const channel = await this.client.rest.patch<APIChannel>(`/channels/${id}`, {
            body: await ChannelDataResolver(data),
            reason: reason as string,
        });

        let _channel = this.cache.get(id)!;

        if (_channel) {
            _channel = _channel._patch(channel as any);
        }

        return this.cache._add(channel.id, _channel ?? this._createChannel(channel));
    }

    public async fetch(
        id: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<AnyChannel> {
        let _channel = this.cache.get(id)!;

        if (!force && _channel) {
            return _channel;
        } else {
            const channel = await this.client.rest.get<APIChannel>(`/channels/${id}`);

            if (_channel) {
                _channel = _channel._patch(channel as any);
            }

            return this.cache._add(channel.id, _channel ?? this._createChannel(channel));
        }
    }

    public async fetchMessage(
        channelId: Snowflake,
        messageId?: Snowflake
    ): Promise<CollectionLike<Snowflake, Message>> {
        if (messageId) {
            const message = await this.client.rest.get<APIMessage>(
                `/channels/${channelId}/messages/${messageId}`
            );

            const _channel = this.cache.get(channelId)!;

            if (_channel) {
                (_channel as any).caches.messages.cache.set(
                    message.id,
                    new Message(this.client, message)
                );
            }

            return new Message(this.client, message);
        } else {
            const messages = await this.client.rest.get<APIMessage[]>(
                `/channels/${channelId}/messages`
            );

            const result = new Collection<Snowflake, Message>();

            const _channel = this.cache.get(channelId)!;

            for (const message of messages) {
                result.set(message.id, new Message(this.client, message));
            }

            if (_channel) {
                (_channel as any).caches.messages.cache.clear();
                (_channel as any).caches.messages.cache.concat(result);
            }

            return result;
        }
    }

    public async deleteMessage(channelId: Snowflake, messageId: Snowflake, reason?: string) {
        await this.client.rest.delete(`/channels/${channelId}/messages/${messageId}`, {
            reason: reason,
        });

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches.messages.cache.delete(messageId);
        }
    }

    public async editMessage(
        channelId: Snowflake,
        messageId: Snowflake,
        data: EditMessageData
    ): Promise<Message> {
        if (data.files) {
            const files = [];

            for await (const file of data.files) {
                files.push(await DataResolver.resolveFile(file));
            }

            //@ts-ignore
            data.files = files;
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        if ('flags' in data) {
            data.flags = new MessageFlagsBitField().set(MessageFlagsBitsResolver(data.flags!));
        }

        const message = await this.client.rest.patch<APIMessage>(
            `/channels/${channelId}/messages/${messageId}`,
            {
                body: data,
                appendBodyToFormData: true,
                // @ts-ignore
                files: data.files,
            }
        );

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            // @ts-ignore
            let _message = (_channel as any).caches.messages.cache.get(messageId);

            if (_message) {
                _message = _message._patch(message);
            } else {
                _message = new Message(this.client, message);
            }

            return _message;
        } else {
            return new Message(this.client, message);
        }
    }

    public async createMessage(channelId: Snowflake, data: CreateMessageData) {
        if (data.files) {
            const files = [];

            for await (const file of data.files) {
                files.push(await DataResolver.resolveFile(file));
            }

            //@ts-ignore
            data.files = files;
        }

        if (data.embeds) {
            for (const embed of data.embeds) {
                embed.color &&= ColorResolver(embed.color);
            }
        }

        if ('flags' in data) {
            data.flags = new MessageFlagsBitField().set(MessageFlagsBitsResolver(data.flags!));
        }

        // @ts-ignore
        data.sticker_ids = data.stickers;

        data = deleteProperty(data, 'stickers');

        const message = await this.client.rest.post<APIMessage>(`/channels/${channelId}/messages`, {
            body: data,
            appendBodyToFormData: true,
            // @ts-ignore
            files: data.files,
        });

        const _message = new Message(this.client, message);

        const _channel = this.cache.get(channelId)!;

        if (_channel) {
            (_channel as any).caches?.messages?.cache.set(message.id, _message);
        }

        return _message;
    }

    public async crosspostMessage(channelId: Snowflake, messageId: Snowflake) {
        const message = await this.client.rest.post<APIMessage>(
            `/channels/${channelId}/messages/${messageId}/crosspost`
        );

        const _channel = this.cache.get(channelId)!;
        const _message = new Message(this.client, message);

        if (_channel) {
            (_channel as any).caches.messages.cache.set(message.id, _message);
        }

        return _message;
    }

    public async triggerTyping(id: Snowflake) {
        await this.client.rest.post(`/channels/${id}/typing`);
    }
}
