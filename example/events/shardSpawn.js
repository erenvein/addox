const { gray, green, magenta } = require('colorette');

module.exports = {
    name: 'shardSpawn',
    /**
     *
     * @param {import("../../src/index").WebSocketShard} shard
     */
    execute(shard) {
        console.log(`[${magenta(`LOG/${green('INFO')}`)}] Shard ${gray(shard.id + 1)} spawned.`);
    },
};
