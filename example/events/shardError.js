const { gray, red, magenta } = require('colorette');

module.exports = {
    name: 'shardError',
    /**
     *
     * @param {import("../../src/index").WebSocketShard} shard
     * @param {Error} error
     */
    execute(shard, error) {
        console.log(
            `[${magenta(`LOG/${red('CRITIC')}`)}] Shard ${gray(
                shard.id + 1
            )} sending errors.\nError: ${gray(error.stack)}`
        );
    },
};
