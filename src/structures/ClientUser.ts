import { User, type PresenceData, type ClientUserEditData, type APIUser } from '../';

export class ClientUser extends User {
    public setPresence(data: PresenceData, shardId?: number): null | void {
        if (shardId) {
            const shard = this.client.ws.shards.get(shardId);

            if (!shard) return null;

            shard.setPresence(data);
        } else {
            this.client.ws.broadcastEval(`this.setPresence(data)`);
        }
    }

    public async edit(data: ClientUserEditData): Promise<ClientUser> {
        const user: APIUser = await this.client.rest.patch(`/users/@me`, {
            body: JSON.stringify(data),
        });

        this._patch(user);

        return this;
    }
}
