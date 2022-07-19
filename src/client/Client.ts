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

    public override on<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => void
    ): this;
    public override on(event: string | symbol, ...args: any[]): this;
    public override on(event: string | symbol, listener: (...args: any) => any) {
        super.on(event, listener);
        return this;
    }

    public override once<K extends keyof ClientEvents>(
        event: K,
        listener: (...args: ClientEvents[K]) => void
    ): this;
    public override once(event: string | symbol, ...args: any[]): this;
    public override once(event: string | symbol, listener: (...args: any) => any) {
        super.once(event, listener);
        return this;
    }

    public override emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    public override emit(event: string | symbol, ...args: any[]): boolean;
    public override emit(event: string | symbol, ...args: any[]) {
        return super.emit(event, ...args);
    }
}
