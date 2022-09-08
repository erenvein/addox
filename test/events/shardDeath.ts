import type { WebSocketShard } from '../../src/index';

export default {
    name: 'shardDeath',
    execute(shard: WebSocketShard, code: number, reason: string) {
        console.log(`Shard ${shard.id + 1} death.\nReason: ${reason}\nCode: ${code}`);
    },
};
