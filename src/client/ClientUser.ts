import type { PresenceData, ClientUserEditData, APIUser } from '../index';

import { User } from '../structures/User';

export class ClientUser extends User {
    public setPresence(data: PresenceData, shardId?: number): void {
        if (shardId !== undefined) {
            const shard = this.client.ws.shards.get(shardId);
            if (!shard) return undefined;

            shard.setPresence(data);
        } else {
            this.client.ws.shards.forEach((shard) => shard.setPresence(data));
            for (const shard of this.client.ws.shards.values()) {
                shard.setPresence(data);
            }
        }
    }

    public async edit(data: ClientUserEditData): Promise<ClientUser> {
        const user: APIUser = await this.client.rest.patch(`/users/@me`, {
            body: data,
        });

        this._patch(user);

        return this;
    }

    public override async fetch(): Promise<ClientUser> {
        const user = await this.client.rest.get<APIUser>(`/users/@me`);

        this._patch(user);

        return this;
    }
}
