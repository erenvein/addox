import {
    type Client,
    type Snowflake,
    type GuildEmoji,
    type Role,
    type Presence,
    ClientGuildManager,
    ClientUserManager,
    ClientStickerManager,
    Collection,
    ClientChannelManager,
    ClientStageInstanceManager,
    ClientWebhookManager,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class ClientCacheManager extends BaseManager {
    public guilds: ClientGuildManager;
    public users: ClientUserManager;
    public stickers: ClientStickerManager;
    public channels: ClientChannelManager;
    public stageInstances: ClientStageInstanceManager;
    public webhooks: ClientWebhookManager;

    public constructor(client: Client) {
        super(client);

        this.guilds = new ClientGuildManager(client);
        this.users = new ClientUserManager(client);
        this.stickers = new ClientStickerManager(client);
        this.channels = new ClientChannelManager(client);
        this.stageInstances = new ClientStageInstanceManager(client);
        this.webhooks = new ClientWebhookManager(client);
    }

    public get emojis() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator: any, guild) => accumulator.concat(guild.caches.emojis.cache),
            new Collection<Snowflake, GuildEmoji>()
        );
    }

    public get roles() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator: any, guild) => accumulator.concat(guild.caches.roles.cache),
            new Collection<Snowflake, Role>()
        );
    }

    public get presences() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.presences),
            new Collection<Snowflake, Presence>()
        );
    }
}
