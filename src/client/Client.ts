import {
    type ClientOptions,
    BitField,
    WebSocketManager,
    BaseClient,
    GatewayIntentBits,
    GatewayDispatchEvents,
    RequestManager,
    DISCORD_API_URL,
    DISCORD_API_VERSION,
} from '../';

export class Client extends BaseClient {
    public intents: number;
    public token: string | null;
    public user: any | null;
    public ws!: WebSocketManager;
    public rest: RequestManager;
    public shardCount: number | 'auto' = 'auto';
    public constructor({ intents, ws, shardCount, rest }: ClientOptions) {
        super();

        this.token = null;
        this.user = null;

        if (typeof intents === 'string') {
            intents = GatewayIntentBits[intents] as number;
        } else if (Array.isArray(intents)) {
            intents = intents.map((intent) => GatewayIntentBits[intent]) as number[];
        }

        this.intents = new BitField().set(intents);
        this.shardCount = shardCount ?? 'auto';

        this.ws = new WebSocketManager(ws);
        this.rest = new RequestManager({
            ...rest,
            baseURL: `${DISCORD_API_URL}/v${DISCORD_API_VERSION}`,
        });
    }

    public async connect(token: string) {
        this.token = token;

        this.rest.setToken(token);
        await this.ws.connect(this);
    }

    public emit(eventName: keyof typeof GatewayDispatchEvents, ...args: any[]): any {
        super.emit(eventName, ...args);
    }
}
