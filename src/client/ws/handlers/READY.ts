import { BaseWebSocketHandler, ClientUser } from '../../../';

export default class ReadyHandler extends BaseWebSocketHandler {
    public constructor() {
        super('Ready');
    }

    public handle(data: any) {
        this.client.user = new ClientUser(this.client, data.user);

        this.client.emit('Ready', this.client);
    }
}
