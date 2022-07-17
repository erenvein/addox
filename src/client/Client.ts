import { type ClientOptions, BitField, WebSocketManager, BaseClient } from '../';

export class Client extends BaseClient {
    public intents: number;
    public token: string | null;
    public user: any | null;
    public ws!: WebSocketManager;
    public constructor({ intents, ws }: ClientOptions) {
        super();

        this.token = null;
        this.user = null;

        this.intents = new BitField().set(intents);

        this.ws = new WebSocketManager(ws);
    }

    public async connect(token: string) {
        this.token = token;

        await this.ws.connect(this);
    }
}
