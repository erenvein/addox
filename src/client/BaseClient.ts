import { EventEmitter } from 'node:events';
import {
    DiscordAPIURL,
    DiscordAPIVersion,
    RequestManager,
    PartialRequestManagerOptions,
    RequestManagerOptions,
} from '../';

export class BaseClient extends EventEmitter {
    public rest: RequestManager;

    public constructor(
        requestManagerOptions: PartialRequestManagerOptions | RequestManagerOptions
    ) {
        super();

        this.rest = new RequestManager({
            ...requestManagerOptions,
            baseURL: `${DiscordAPIURL}/v${DiscordAPIVersion}`,
        });
    }
}
