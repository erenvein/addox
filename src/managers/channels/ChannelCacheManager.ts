import type { Client } from './../../index';

import { BaseManager } from '../BaseManager';

export class ChannelCacheManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }
}
