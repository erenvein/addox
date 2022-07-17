import { type ClientOptions, WebSocketManager, BaseClient } from '../';
export declare class Client extends BaseClient {
    intents: number;
    token: string | null;
    user: any | null;
    ws: WebSocketManager;
    constructor({ intents, ws }: ClientOptions);
    login(token: string): void;
}
