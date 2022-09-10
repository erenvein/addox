import {
    type GatewayMessageReactionRemoveEmojiDispatch,
    BaseWebSocketHandler,
    MessageReaction,
} from '../../../index';

export default class MessageReactionRemoveEmojiHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayMessageReactionRemoveEmojiDispatch) {
        this.shard.manager.emit(
            'messageReactionRemoveEmoji',
            new MessageReaction(this.shard.manager.client, d)
        );
    }
}
