import type { Client } from '../../src/index';

export default {
    name: 'ready',
    execute(client: Client) {
        console.log(`Logged in as ${client.user!.tag}!`);
    },
};
