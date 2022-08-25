import type { Snowflake, APIThreadMember, Client, ThreadChannel } from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class ThreadMember extends BaseStructure {
    public threadId!: Snowflake | null;
    public userId!: Snowflake | null;
    public joinedTimestamp!: number;
    public flags!: number;

    public constructor(client: Client, data: APIThreadMember) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIThreadMember) {
        super._patch(data);

        this.threadId = data.id ?? null;
        this.userId = data.user_id ?? null;
        this.joinedTimestamp = new Date(data.join_timestamp).getTime();
        this.flags = data.flags;

        return this;
    }

    public get joinedAt() {
        return new Date(this.joinedTimestamp);
    }

    public get user() {
        return this.client.caches.users.cache.get(this.userId!);
    }

    public get member() {
        return this.thread!.guild.caches.members.cache.get(this.userId!);
    }

    public get thread() {
        return this.client.caches.channels.cache.get(this.threadId!) as ThreadChannel | undefined;
    }

    public async remove() {
        return await this.thread!.caches.members.remove(this.userId!);
    }
}
