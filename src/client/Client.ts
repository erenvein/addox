import {
    type ClientOptions,
    WebSocketManager,
    BaseClient,
    ClientUser,
    ClientCacheManager,
} from '../index';

export class Client extends BaseClient {
    public user: ClientUser | null;
    public ws: WebSocketManager;
    public uptime: number;
    public caches: ClientCacheManager;
    public failIfNotExists: boolean;

    public constructor({ ws, rest, failIfNotExists }: ClientOptions) {
        super(rest!);

        this.user = null;
        this.uptime = -1;
        this.failIfNotExists = failIfNotExists ?? false;

        this.ws = new WebSocketManager(this, ws);
        this.caches = new ClientCacheManager(this);
    }

    public destroy() {
        this.user = null;
        this.uptime = -1;

        this.ws.destroy();
        this.rest.setToken(null);
    }
}
