import { type GatewayTypingStartDispatch, BaseWebSocketHandler, Typing } from '../../../index';

export default class TypingStartHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayTypingStartDispatch) {
        this.shard.manager.emit('typingStart', new Typing(this.shard.manager.client, d));
    }
}
