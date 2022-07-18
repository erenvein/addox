import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { type RequestInit } from 'node-fetch';
import type { RESTOptions } from '../..';

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

        const fullRoute = this.baseURL + route;

        const response = await fetch(fullRoute, options);

        const data = await response.json();
        const status = response.status;

        this.queue.shift();

        return data;
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
