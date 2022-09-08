import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardReady',
    execute(shard: WebSocketShard) {
        console.log(`Shard ${shard.id + 1} ready.`);
    },
};
