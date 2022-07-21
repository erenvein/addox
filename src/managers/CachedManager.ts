import { Collection, type Client } from '..';

import { BaseManager } from './BaseManager';

export class CachedManager<K, V> extends BaseManager {
    public cache = new Collection<K, V>();

    public constructor(client: Client) {
        super(client);
    }
}
