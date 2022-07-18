import { BaseWebSocketEvent } from '../../..';

export default class WebSocketErrorEvent extends BaseWebSocketEvent {
    public constructor() {
        super('error');
    }

    public handle(err: any) {
        console.error(err);
    }
}
