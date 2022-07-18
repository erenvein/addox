import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { type RequestInit } from 'node-fetch';

export class RequestManager {
    public queue = new AsyncQueue();
    public token: string | undefined;

    public async request(url: string, options: RequestInit = {}) {
        this.queue.shift();

        if (this.token) {
            //@ts-ignore
            options.headers.Auhorization = this.token;
        }

        const response = await fetch(url, options);
    }

    public setToken(token: `${'Bearer' | 'BOT'} ${string}`) {
        this.token = token;
    }
}
