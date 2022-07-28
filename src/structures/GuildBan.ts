import type { Client, APIBan, Guild, Snowflake, GatewayGuildBanAddDispatchData } from '../index';

import { BaseStructure } from './BaseStructure';

export class GuildBan extends BaseStructure {
    public userId!: Snowflake;
    public reason!: string | null;
    public guild: Guild;

    public constructor(client: Client, guild: Guild, data: APIBan | GatewayGuildBanAddDispatchData) {
        super(client);

        this.guild = guild;

        this._patch(data);
    }

    public override _patch(data: GatewayGuildBanAddDispatchData | APIBan) {
        this.userId = data.user.id;
        
        if ('reason' in data) {
            this.reason = data.reason;
        } else {
            this.reason ??= null;
        }

        return this;
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId);
    }

    public get member() {
        return this.guild.caches.members.cache.get(this.userId);
    }

    public async fetch() {
        return await this.guild.caches.bans.fetch(this.userId);
    }
}
