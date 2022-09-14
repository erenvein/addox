import {
    type RequestManagerOptions,
    type RateLimitData,
    DiscordAPIError,
    RateLimitError,
    Collection,
    RequestOptions,
    Sleep,
    deleteProperty,
} from '../../index';
import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { Response } from 'node-fetch';
import FormData from 'form-data';

export class RequestManager {
    public queue = new AsyncQueue();
    public rejectOnRateLimit: boolean;
    public offset: number;
    public baseURL: string;
    public authPrefix: 'Bot' | 'Bearer';
    public baseHeaders: Record<string, string>;
    public retries: number;
    public agent: string;
    public requestTimeout: number;
    #retrys = new Collection<`/${string}`, number>();
    #rateLimits = new Collection<string, RateLimitData>();
    #globalRateLimitData: RateLimitData = { limited: false };
    #token: string | null | undefined;

    public constructor({
        offset,
        rejectOnRateLimit,
        baseURL,
        authPrefix,
        retries,
        baseHeaders,
        agent,
        requestTimeout,
    }: RequestManagerOptions) {
        this.rejectOnRateLimit = rejectOnRateLimit ?? false;
        this.offset = offset ?? 250;
        this.baseURL = baseURL;
        this.authPrefix = authPrefix ?? 'Bot';
        this.retries = retries ?? 2;
        this.baseHeaders = baseHeaders ?? {
            'content-type': 'application/json',
        };
        this.agent = agent ?? '';
        this.requestTimeout = requestTimeout ?? 15000;
    }

    public get token() {
        return this.#token;
    }

    public get rateLimits(): Collection<string, RateLimitData> {
        return this.#rateLimits;
    }

    public get retrys(): Collection<string, number> {
        return this.#retrys;
    }

    public get globalRateLimitData(): RateLimitData {
        return this.#globalRateLimitData;
    }

    public async request<T>(route: `/${string}`, options: RequestOptions = {}): Promise<T> {
        await this.queue.wait();

        if (!options.headers) options.headers = {};
        if (!options.appendBodyToFormData) options.appendBodyToFormData = false;

        options.headers = { ...options.headers, ...this.baseHeaders };
        options.method ||= 'Get';

        if (this.#token && !options.headers['Authorization']) {
            options.headers['Authorization'] = this.#token;
        }

        if (options.reason) {
            options.headers['X-Audit-Log-Reason'] = encodeURIComponent(options.reason);
        }

        if (this.agent.length || options.agent?.length) {
            options.headers['User-Agent'] = options.agent ?? this.agent;
        }

        if (options.query) {
            const parsedQuery = Object.entries(options.query)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            route += parsedQuery.length ? `?${parsedQuery}` : '';
        }

        const oldBody = options.body;
        const oldFiles = options.files;

        if (options.files?.length) {
            const formData = new FormData();

            if (options.files?.length) {
                for (let i = 0; i < options.files.length; i++) {
                    const file = options.files[i]!;

                    formData.append(file.key ?? `files[${i}]`, file.data, {
                        contentType: file.type,
                        filename: file.name,
                    });
                }
            }

            if (options.body) {
                if (options.appendBodyToFormData) {
                    for (const [key, value] of Object.entries(options.body)) {
                        let resolvedValue = value;

                        formData.append(key, resolvedValue);
                    }
                } else {
                    formData.append('payload_json', JSON.stringify(options.body));
                }
            }

            options.body = formData;
            deleteProperty(options.headers, 'content-type');
        } else if (options.body) {
            options.body = JSON.stringify(options.body);
            options.headers['content-type'] = 'application/json';
        }

        //@ts-ignore
        if (options.method === 'Get') options.body = undefined;

        const fullRoute = this.baseURL + route;

        if (this.#globalRateLimitData.limited) {
            await Sleep(this.#globalRateLimitData.retry!);

            this.#rateLimits.clear();
            this.#globalRateLimitData = { limited: false };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.requestTimeout);

        try {
            const response = await fetch(fullRoute, {
                method: options.method,
                body: options.body as any,
                headers: options.headers,
                signal: controller.signal as any,
            });

            const data = (await this._parseResponse(response)) as T;
            const status = response.status;

            if (status === 403) {
                this.#token = null;
            }

            if (status >= 200 && status < 300) {
                return data;
            } else if (status === 429) {
                const scope = response.headers.get('x-ratelimit-scope');
                const limit = response.headers.get('x-ratelimit-limit');
                const remaining = response.headers.get('x-ratelimit-remaining');
                const reset = response.headers.get('x-ratelimit-reset-after');
                const hash = response.headers.get('x-ratelimit-bucket');
                const retry = response.headers.get('retry-after');

                if (scope === 'global') {
                    this.#globalRateLimitData = {
                        scope: (scope as any) || 'user',
                        limit: limit ? +limit : Infinity,
                        remaining: remaining ? +remaining : 1,
                        reset: reset ? Date.now() + +reset * 1000 + this.offset : Date.now(),
                        retry: retry ? +retry * 1000 + this.offset : 0,
                        limited: true,
                        route,
                    };
                } else {
                    this.rateLimits.set(route, {
                        scope: (scope as any) || 'user',
                        limit: limit ? +limit : Infinity,
                        remaining: remaining ? +remaining : 1,
                        reset: reset ? Date.now() + +reset * 1000 + this.offset : Date.now(),
                        retry: retry ? +retry * 1000 + this.offset : 0,
                        limited: true,
                        route,
                    });
                }

                const rateLimitData = this.#globalRateLimitData.limited
                    ? this.#globalRateLimitData
                    : this.rateLimits.get(route)!;

                if (this.rejectOnRateLimit) {
                    throw new RateLimitError(
                        rateLimitData.limit?.toString()!,
                        rateLimitData.remaining?.toString()!,
                        rateLimitData.reset?.toString()!,
                        hash!,
                        rateLimitData.retry?.toString()!,
                        rateLimitData.scope!,
                        status,
                        options.method,
                        fullRoute
                    );
                }

                const rateLimitRetry = this.#globalRateLimitData.limited
                    ? this.#globalRateLimitData.retry
                    : this.#rateLimits.get(route)?.retry;

                await Sleep(rateLimitRetry!);

                return this.request(route, options);
            } else if ((status >= 400 && status < 500) || (status >= 500 && status < 600)) {
                throw new DiscordAPIError(
                    status,
                    //@ts-ignore
                    data.code,
                    options.method,
                    fullRoute,
                    //@ts-ignore
                    data.message,
                    {
                        files: oldFiles,
                        body: oldBody,
                    }
                );
            } else {
                return data;
            }
        } catch (error) {
            let retries = this.retrys.get(route) || 0;

            if (error instanceof Error && error.name === 'AbortError' && retries < this.retries) {
                this.retrys.set(route, ++retries);
                return this.request(route, options);
            }

            this.retrys.delete(route);
            throw error;
        } finally {
            clearTimeout(timeout);
            this.queue.shift();
        }
    }

    public async get<T>(route: `/${string}`, options: RequestOptions = {}) {
        return await this.request<T>(route, { ...options, method: 'Get' });
    }

    public async post<T>(route: `/${string}`, options: RequestOptions = {}) {
        return await this.request<T>(route, { ...options, method: 'Post' });
    }

    public async put<T>(route: `/${string}`, options: RequestOptions = {}) {
        return await this.request<T>(route, { ...options, method: 'Put' });
    }

    public async patch<T>(route: `/${string}`, options: RequestOptions = {}) {
        return await this.request<T>(route, { ...options, method: 'Patch' });
    }

    public async delete<T>(route: `/${string}`, options: RequestOptions = {}) {
        return await this.request<T>(route, { ...options, method: 'Delete' });
    }

    public setToken(token: string | null) {
        if (!token) {
            this.#token = null;
        } else {
            this.#token = this.authPrefix + ' ' + token;
        }
    }

    private async _parseResponse(response: Response) {
        if (response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        } else if (response.headers.get('content-type')?.includes('text/html')) {
            return await response.text();
        }

        return await response.arrayBuffer();
    }
}
