import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardError',
    execute(shard: WebSocketShard, error: any) {
        console.error(error.stack);
    },
};
