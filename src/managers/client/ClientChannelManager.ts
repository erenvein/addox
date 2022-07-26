import {
    type Snowflake,
    type Client,
    type APIChannel,
    type EditChannelData,
    type APIMessage,
    type AnyChannel,
    ChannelType,
    DMChannel,
    FetchOptions,
    ChannelDataResolver,
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

    public async edit(id: Snowflake, data: EditChannelData, reason?: string) {
        const channel = await this.client.rest.patch<APIChannel>(`/channels/${id}`, {
            body: await ChannelDataResolver(data),
            reason: reason as string,
        });

        let _channel = this.cache.get(id)!;

        if (_channel) {
            _channel = _channel._patch(channel as any);
        }

        return this.cache._add(channel.id, _channel ?? (this._createChannel(channel) as any));
    }

    public async fetch(id: Snowflake, { force }: FetchOptions = { force: false }) {
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

    public async fetchMessage(id?: Snowflake) {
        if (id) {
            const message = await this.client.rest.get<APIMessage>(
                `/channels/${id}/messages/${id}`
            );
        } else {
            const messages = await this.client.rest.get<APIMessage[]>(`/channels/${id}/messages`);
        }
    }
}
