import type { GatewayDispatchEvents, Client } from '../../..';

export class BaseWebSocketHandler {
    public name: keyof typeof GatewayDispatchEvents;
    public client!: Client;
    public constructor(name: keyof typeof GatewayDispatchEvents) {
        this.name = name;
    }

    public handle(data: any) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
