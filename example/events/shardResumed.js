const { gray, green, magenta } = require('colorette');

module.exports = {
    name: 'shardResumed',
    /**
     *
     * @param {import("../../src/index").WebSocketShard} shard
     */
    execute(shard) {
        console.log(`[${magenta(`LOG/${green('INFO')}`)}] Shard ${gray(shard.id + 1)} resumed.`);
    },
};
