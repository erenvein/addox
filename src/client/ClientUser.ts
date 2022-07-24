import type { PresenceData, ClientUserEditData, APIUser } from '../index';

import { User } from '../structures/User';

export class ClientUser extends User {
    public setPresence(data: PresenceData, shardId?: number): null | void {
        if (shardId !== undefined) {
            const shard = this.client.ws.shards.get(shardId);

            if (!shard) return null;

            shard.setPresence(data);
        } else {
            this.client.ws.broadcastEval(`this.setPresence(${JSON.stringify(data)})`);
        }
    }

    public async edit(data: ClientUserEditData): Promise<ClientUser> {
        const user: APIUser = await this.client.rest.patch(`/users/@me`, {
            body: data,
        });

        this._patch(user);

        return this;
    }
}
