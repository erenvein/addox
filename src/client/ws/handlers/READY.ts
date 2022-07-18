import { BaseWebSocketHandler } from './BaseWebSocketHandler';

export default class ReadyHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Ready');
    }

    public handle(data: any) {
        this.client.user = data.user;

        this.client.emit('Ready', this.client);
    }
}
