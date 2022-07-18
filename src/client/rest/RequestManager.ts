import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { type RequestInit } from 'node-fetch';
import { type RESTOptions, HTTPError, DiscordAPIError } from '../..';

export class RequestManager {
    public queue = new AsyncQueue();
    public token: string | undefined;
    public rejectOnRateLimit: boolean;
    public offset: number;
    public baseURL: string;
    public authPrefix: 'Bot' | 'Bearer';

    public constructor({ offset, rejectOnRateLimit, baseURL, authPrefix }: RESTOptions) {
        this.rejectOnRateLimit = rejectOnRateLimit ?? false;
        this.offset = offset ?? 250;
        this.baseURL = baseURL;
        this.authPrefix = authPrefix ?? 'Bot';
    }

    private initRateLimit() {
        if (!this.rejectOnRateLimit) return;
    }

    public async request(route: `/${string}`, options: RequestInit = {}) {
        await this.queue.wait();

        if (this.token) {
            //@ts-ignore
            if (!options.headers) options.headers = {};

            //@ts-ignore
            options.headers.Authorization = this.token;
        }

        options.method ??= 'GET';

        const fullRoute = this.baseURL + route;

        const response = await fetch(fullRoute, options);

        const data = await response.json();
        const status = response.status;

        try {
            if (status >= 200 && status < 300) {
                return data;
            } else if (status === 401) {
                throw new HTTPError(status, options.method, fullRoute, 'Unauthorized');
            } else if (status === 403) {
                throw new HTTPError(status, options.method, fullRoute, 'Forbidden');
            } else if (status >= 500 && status < 600) {
                throw new HTTPError(status, options.method, fullRoute, 'Internal Server Error');
            } else if (status === 429) {
                console.log('Rate Limited!\n\n');

                const limit = response.headers.get('x-ratelimit-limit');
                const remaining = response.headers.get('x-ratelimit-remaining');
                const reset = response.headers.get('x-ratelimit-reset-after');
                const hash = response.headers.get('x-ratelimit-bucket');
                const retry = response.headers.get('retry-after');

                console.log(
                    `Limit: ${limit}\nRemaining: ${remaining}\nReset: ${reset}\nHash: ${hash}\nRetry: ${retry}`
                );
            } else if (status >= 400 && status < 500) {
                throw new DiscordAPIError(
                    status,
                    data.code,
                    options.method,
                    fullRoute,
                    data.message
                );
            } else {
                return data;
            }
        } finally {
            this.queue.shift();
        }
    }

    public async get(route: `/${string}`, options: RequestInit = {}) {
        return await this.request(route, { ...options, method: 'GET' });
    }

    public async post(route: `/${string}`, options: RequestInit = {}) {
        return await this.request(route, { ...options, method: 'POST' });
    }

    public async put(route: `/${string}`, options: RequestInit = {}) {
        return await this.request(route, { ...options, method: 'PUT' });
    }

    public async patch(route: `/${string}`, options: RequestInit = {}) {
        return await this.request(route, { ...options, method: 'PATCH' });
    }

    public async delete(route: `/${string}`, options: RequestInit = {}) {
        return await this.request(route, { ...options, method: 'DELETE' });
    }

    public setToken(token: string) {
        this.token = this.authPrefix + ' ' + token;
    }
}
