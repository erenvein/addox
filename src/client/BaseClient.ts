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
            agent: `DiscordAPIWrapper (https://github.com/deliever42/discord-api-wrapper, 1.0.0)`,
        });
    }
}
