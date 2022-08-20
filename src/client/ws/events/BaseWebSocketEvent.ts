import type { WebSocketShard } from '../../../index';

export class BaseWebSocketEvent {
    public name: any;
    public shard!: WebSocketShard;
    
    public constructor(name: any) {
        this.name = name;
    }

    //@ts-ignore
    public handle(...args: any[]) {
        throw new ReferenceError('This Method Not Implemented!');
    }
}
