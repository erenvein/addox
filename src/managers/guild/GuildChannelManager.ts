import {
    type GuildBasedChannelResolvable,
    type Snowflake,
    type Guild,
    type Client,
    type CreateGuildChannelData,
    type APIChannel,
    type RESTGetAPIGuildThreadsResult,
    type FetchOptions,
    type CollectionLike,
    Collection,
    ChannelDataResolver,
} from '../../index';

import { CachedManager } from '../CachedManager';

export class GuildChannelManager extends CachedManager<Snowflake, GuildBasedChannelResolvable> {
    public guild: Guild;

    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async create(data: CreateGuildChannelData, reason?: string) {
        const channel = await this.client.rest.post<APIChannel>(
            `/guilds/${this.guild.id}/channels`,
            {
                body: ChannelDataResolver(data),
                reason: reason,
            }
        );

        return this.cache._add(
            channel.id,
            this.client.caches.channels.cache._add(
                channel.id,
                this.client.caches.channels._createChannel(channel) as GuildBasedChannelResolvable
            ) as GuildBasedChannelResolvable
        );
    }

    public async fetch(
        id?: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, GuildBasedChannelResolvable>> {
        if (id) {
            const _role = this.cache.get(id)!;

            if (!force && _role) {
                return _role;
            }

            const channels = (await this.fetch(undefined, {
                force: force as boolean,
            })) as Collection<Snowflake, GuildBasedChannelResolvable>;

            return channels.get(id)!;
        } else {
            const channels = await this.client.rest.get<APIChannel[]>(
                `/guilds/${this.guild.id}/channels`
            );

            const result = new Collection<Snowflake, GuildBasedChannelResolvable>();

            for (const channel of channels) {
                let _channel = this.cache.get(channel.id!)!;

                if (_channel) {
                    _channel = _channel._patch(channel as never);
                }

                result.set(
                    channel.id,
                    this.client.caches.channels.cache._add(
                        channel.id,
                        _channel ??
                            (this.client.caches.channels._createChannel(
                                channel
                            ) as GuildBasedChannelResolvable)
                    ) as GuildBasedChannelResolvable
                );
            }

            this.cache.clear();
            this.cache.concat(result);

            return this.cache;
        }
    }

    public async fetchActiveThreads() {
        const threads = await this.client.rest.get<RESTGetAPIGuildThreadsResult>(
            `/guilds/${this.guild.id}/threads`
        );

        // TODO
    }

    public async setPosition() {
        // TODO
    }
}
