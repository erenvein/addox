import { setTimeout } from 'node:timers/promises';

export const Sleep = async (ms: number) => await setTimeout(ms);
