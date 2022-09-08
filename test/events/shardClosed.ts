import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardClosed',
    execute(shard: WebSocketShard, code: number, reason: string) {
        console.log(`Shard ${shard.id + 1} closed.\nReason: ${reason}\nCode: ${code}`);
    },
};
