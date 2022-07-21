import type { Client } from './../client/..';

export class BaseManager {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
}