import type { Client } from '../../index';

export class BaseStructure {
    public client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    // @ts-ignore
    public _patch(data: any): this {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
