import type { Client } from '..';

export class BaseStructure {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public _patch(data: any): this {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
