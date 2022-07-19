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
}
