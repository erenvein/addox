import {
    type ClientOptions,
    BitField,
    WebSocketManager,
    BaseClient,
    RequestManager,
    ClientUser,
    GatewayIntentBitsResolver,
    DiscordAPIURL,
    DiscordAPIVersion,
    ClientEvents,
} from '../';

export class Client extends BaseClient {
    public intents: number;
    public token: string | null;
    public user: ClientUser | null;
    public ws: WebSocketManager;
    public rest: RequestManager;
    public shardCount: number | 'auto' = 'auto';
    public constructor({ intents, ws, shardCount, rest }: ClientOptions) {
        super();

        this.token = null;
        this.user = null;

        this.intents = new BitField().set(GatewayIntentBitsResolver(intents));
        this.shardCount = shardCount ?? 'auto';

        this.ws = new WebSocketManager(ws);
        this.rest = new RequestManager({
            ...rest,
            baseURL: `${DiscordAPIURL}/v${DiscordAPIVersion}`,
        });
    }

    public async connect(token: string) {
        this.token = token;

        this.rest.setToken(token);
        await this.ws.connect(this);
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
