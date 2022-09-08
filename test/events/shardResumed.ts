import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardResumed',
    execute(shard: WebSocketShard) {
        console.log(`Shard ${shard.id + 1} resumed.`);
    },
};
