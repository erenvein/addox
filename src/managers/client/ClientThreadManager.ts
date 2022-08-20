import type { Client } from '../../index';

import { BaseManager } from './../base/BaseManager';

export class ClientThreadManager extends BaseManager {
    public constructor(client: Client) {
        super(client);
    }

    public get cache() {
        // TODO
        return void 0
    }
}
