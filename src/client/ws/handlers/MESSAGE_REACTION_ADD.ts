import {
    type GatewayMessageReactionAddDispatch,
    BaseWebSocketHandler,
    MessageReaction,
} from '../../../index';

export default class MessageReactionAddHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionAddDispatch) {
        this.shard.manager.emit(
            'messageReactionAdd',
            new MessageReaction(this.shard.manager.client, d)
        );
    }
}
