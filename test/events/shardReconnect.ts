import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardReconnect',
    execute(shard: WebSocketShard) {
        console.log(`Shard ${shard.id + 1} reconnecting.`);
    },
};
