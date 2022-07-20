import {
    type ClientOptions,
    WebSocketManager,
    BaseClient,
    RequestManager,
    ClientUser,
    DiscordAPIURL,
    DiscordAPIVersion,
    ClientEvents,
} from '../';

export declare interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => void
    ): this;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): any;
}

export class Client extends BaseClient {
    public token: string | null;
    public user: ClientUser | null;
    public ws: WebSocketManager;
    public rest: RequestManager;
    public uptime: number;
    public constructor({ ws, rest }: ClientOptions) {
        super();

        this.token = null;
        this.user = null;
        this.uptime = -1;

        this.rest = new RequestManager({
            ...rest,
            baseURL: `${DiscordAPIURL}/v${DiscordAPIVersion}`,
        });
        this.ws = new WebSocketManager(this, ws);
    }

    public destroy() {
        this.user = null;
        this.token = null;
        this.uptime = -1;

        this.ws.destroy();
        this.rest.token = undefined;
    }
}
