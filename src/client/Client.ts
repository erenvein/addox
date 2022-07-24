import {
    type ClientOptions,
    WebSocketManager,
    BaseClient,
    ClientUser,
    ClientEvents,
    ClientCacheManager,
} from '../index';

export declare interface Client {
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => void
    ): this;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): any;
}

export class Client extends BaseClient {
    public user: ClientUser | null;
    public ws: WebSocketManager;
    public uptime: number;
    public caches: ClientCacheManager;
    public constructor({ ws, rest }: ClientOptions) {
        super(rest!);

        this.user = null;
        this.uptime = -1;

        this.ws = new WebSocketManager(this, ws);
        this.caches = new ClientCacheManager(this);
    }

    public destroy() {
        this.user = null;
        this.uptime = -1;

        this.ws.destroy();
        this.rest.token = undefined;
    }
}
