import {
    type ClientOptions,
    WebSocketManager,
    BaseClient,
    ClientUser,
    ClientCacheManager,
    CacheStaler,
} from '../index';

export class Client extends BaseClient {
    public user: ClientUser | null;
    public ws: WebSocketManager;
    public uptime: number;
    public caches: ClientCacheManager;
    public failIfNotExists: boolean;

    public constructor({ ws, rest, failIfNotExists, cache }: ClientOptions) {
        super(rest!);

        this.user = null;
        this.uptime = -1;
        this.failIfNotExists = failIfNotExists ?? false;

        this.ws = new WebSocketManager(this, ws);
        this.caches = new ClientCacheManager(this);

        if (typeof cache === 'function') {
            cache(this, CacheStaler);
        }
    }

    public destroy() {
        this.user = null;
        this.uptime = -1;

        this.ws.destroy();
        this.rest.setToken(null);
    }
}
