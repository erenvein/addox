import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { type RequestInit } from 'node-fetch';
import {
    type RESTOptions,
    type RateLimitData,
    HTTPError,
    DiscordAPIError,
    RateLimitError,
} from '../..';

export class RequestManager {
    public queue = new AsyncQueue();
    public token: string | undefined;
    public rejectOnRateLimit: boolean;
    public offset: number;
    public baseURL: string;
    public authPrefix: 'Bot' | 'Bearer';
    #rateLimitData: RateLimitData = {
        limited: false,
    };

    public constructor({ offset, rejectOnRateLimit, baseURL, authPrefix }: RESTOptions) {
        this.rejectOnRateLimit = rejectOnRateLimit ?? false;
        this.offset = offset ?? 250;
        this.baseURL = baseURL;
        this.authPrefix = authPrefix ?? 'Bot';
    }

    public get rateLimitData(): Readonly<RateLimitData> {
        return this.#rateLimitData;
    }

    public get timeToReset(): number {
        return (this.#rateLimitData.reset || -1) + this.offset - Date.now();
    }

    public async request(route: `/${string}`, options: RequestInit = {}): Promise<any> {
        await this.queue.wait();

        if (this.token) {
            //@ts-ignore
            if (!options.headers) options.headers = {};

            //@ts-ignore
            options.headers.Authorization = this.token;
        }

        options.method ||= 'GET';

        const fullRoute = this.baseURL + route;

        while (
            this.rateLimitData.limited &&
            !this.rejectOnRateLimit &&
            this.rateLimitData.scope === 'global' &&
            this.#rateLimitData.retry! > 0
        ) {
            await new Promise((resolve) => setTimeout(resolve, this.#rateLimitData.retry! + 500));
            this.#rateLimitData = { limited: false };
        }

        while (
            this.rateLimitData.limited &&
            !this.rejectOnRateLimit &&
            this.rateLimitData.scope !== 'global' &&
            this.rateLimitData.route! === route &&
            this.#rateLimitData.retry! > 0
        ) {
            await new Promise((resolve) => setTimeout(resolve, this.#rateLimitData.retry! + 500));
            this.#rateLimitData = { limited: false };
        }

        const response = await fetch(fullRoute, options);

        const data = await response.json();
        const status = response.status;

        if (status >= 200 && status < 300) {
            this.queue.shift();
            return data;
        } else if (status === 400) {
            throw new HTTPError(status, options.method, fullRoute, 'Bad Request');
        } else if (status === 401) {
            throw new HTTPError(status, options.method, fullRoute, 'Unauthorized');
        } else if (status === 402) {
            throw new HTTPError(status, options.method, fullRoute, 'Gateway Unvailable');
        } else if (status === 403) {
            throw new HTTPError(status, options.method, fullRoute, 'Forbidden');
        } else if (status === 404) {
            throw new HTTPError(status, options.method, fullRoute, 'Not Found');
        } else if (status === 405) {
            throw new HTTPError(status, options.method, fullRoute, 'Method Not Allowed');
        } else if (status === 429) {
            const scope = response.headers.get('x-ratelimit-scope');
            const limit = response.headers.get('x-ratelimit-limit');
            const remaining = response.headers.get('x-ratelimit-remaining');
            const reset = response.headers.get('x-ratelimit-reset-after');
            const hash = response.headers.get('x-ratelimit-bucket');
            const retry = response.headers.get('retry-after');

            if (this.rejectOnRateLimit) {
                throw new RateLimitError(
                    limit!,
                    remaining!,
                    reset!,
                    hash!,
                    retry!,
                    scope! as any,
                    status,
                    options.method,
                    fullRoute
                );
            }

            this.#rateLimitData = {
                scope: (scope as any) || 'user',
                limit: limit ? +limit : Infinity,
                remaining: remaining ? +remaining : 1,
                reset: reset ? Date.now() + +reset * 1000 + this.offset : Date.now(),
                retry: retry ? +retry * 1000 + this.offset : 0,
                limited: true,
                route,
            };
            this.queue.shift();
        } else if (status >= 400 && status < 500) {
            throw new DiscordAPIError(status, data.code, options.method, fullRoute, data.message);
        } else if (status >= 500 && status < 600) {
            throw new HTTPError(status, options.method, fullRoute, 'Internal Server Error');
        } else {
            this.queue.shift();
            return data;
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
