import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardSpawn',
    execute(shard: WebSocketShard) {
        console.log(`Shard ${shard.id + 1} spawned.`);
    },
};
