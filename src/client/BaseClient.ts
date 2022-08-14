import {
    DiscordAPIURL,
    DiscordAPIVersion,
    RequestManager,
    PartialRequestManagerOptions,
    RequestManagerOptions,
} from '../index';

export class BaseClient {
    public rest: RequestManager;

    public constructor(
        requestManagerOptions: PartialRequestManagerOptions | RequestManagerOptions
    ) {
        this.rest = new RequestManager({
            ...requestManagerOptions,
            baseURL: `${DiscordAPIURL}/v${DiscordAPIVersion}`,
            agent: `DiscordAPIWrapper (https://github.com/deliever42/discord-api-wrapper, 1.0.0)`,
        });
    }
}
