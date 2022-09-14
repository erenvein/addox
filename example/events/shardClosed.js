const { gray, red, magenta } = require('colorette');

module.exports = {
    name: 'shardClosed',
    /**
     *
     * @param {import("../../src/index").WebSocketShard} shard
     * @param {number} code
     * @param {string} reason
     */
    execute(shard, code, reason) {
        console.log(
            `[${magenta(`LOG/${red('CRITIC')}`)}] Shard ${gray(
                shard.id + 1
            )} closed.\nReason: ${gray(reason)}\nCode: ${gray(code)}`
        );
    },
};
