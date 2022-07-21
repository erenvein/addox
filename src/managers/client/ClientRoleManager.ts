import { Role, type Client, Collection, type Snowflake } from '../..';

import { BaseManager } from '../BaseManager';

export class ClientRoleManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        return this.client.caches.guilds.cache.reduce(
            (accumulator, guild) => (accumulator as any).concat(guild.caches.roles.cache),
            new Collection<Snowflake, Role>()
        );
    }
}
