import {
    type Snowflake,
    User,
    type Client,
    type APIUser,
    type APIDMChannel,
    type FetchOptions,
    type CollectionLike,
} from '../..';

import { CachedManager } from '../CachedManager';

export class ClientUserManager extends CachedManager<Snowflake, User> {
    public constructor(client: Client) {
        super(client);
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, User>> {
        if (id) {
            let _user = this.cache.get(id)!;

            if (!force && _user) {
                return _user;
            } else {
                const user = await this.client.rest.get<APIUser>(`/users/${id}`);

                if (_user) {
                    _user = _user._patch(user);
                }

                return this.cache._add(user.id, _user ?? new User(this.client, user));
            }
        } else {
            const users = await this.client.rest.get<APIUser[]>('/users/@me');

            for (const user of users) {
                let _user = this.cache.get(user.id);

                if (_user) {
                    _user = _user._patch(user);
                }

                this.cache.set(user.id, _user ?? new User(this.client, user));
            }

            return this.cache;
        }
    }

    public async createDM(id: Snowflake) {
        const channel = await this.client.rest.post<APIDMChannel>(`/users/@me/channels`, {
            body: ({ recipient_id: id }),
        });

        // TODO
    }

    public async fetchDM(id: Snowflake) {
        const channel = await this.client.rest.get<APIDMChannel>(`/channels/${id}`);

        // TODO
    }

    public async deleteDM(id: Snowflake) {
        await this.client.rest.delete(`/channels/${id}`);

        // TODO
    }
}
