import { type GatewayIntentBitsResolvable, GatewayIntentBits } from '../..';

export function IntentResolver(intents: GatewayIntentBitsResolvable): number | number[] {
    let res = intents;

    if (typeof intents === 'string') {
        res = GatewayIntentBits[intents] as number;
    } else if (Array.isArray(intents)) {
        res = intents.map((intent) => GatewayIntentBits[intent]) as number[];
    }

    return res as number | number[];
}
