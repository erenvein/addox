import { Client, GatewayIntentBits } from '../src/index';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '.env') });

const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((p, c) => (p as any) + c, 0),
});

client.login(process.env.TOKEN as string);
