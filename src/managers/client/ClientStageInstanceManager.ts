import {
    type Client,
    type Snowflake,
    type FetchOptions,
    type EditStageInstanceData,
    type CreateStageInstanceData,
    type APIStageInstance,
    StageInstancePrivacyLevel,
    StageInstance,
} from '../../index';

import { CachedManager } from '../base/CachedManager';

export class ClientStageInstanceManager extends CachedManager<Snowflake, StageInstance> {
    public constructor(client: Client) {
        super(client);
    }

    public async fetch(
        id: Snowflake,
        { force }: FetchOptions = { force: false }
    ): Promise<StageInstance> {
        let _stageInstance = this.cache.get(id)!;

        if (!force && _stageInstance) {
            return _stageInstance;
        } else {
            const stageInstance = await this.client.rest.get<APIStageInstance>(
                `/stage-instances/${id}`
            );

            if (_stageInstance) {
                _stageInstance = _stageInstance._patch(stageInstance);
            }

            return this.cache._add(
                stageInstance.id,
                _stageInstance ?? new StageInstance(this.client, stageInstance)
            );
        }
    }

    public async create(data: CreateStageInstanceData): Promise<StageInstance> {
        if (typeof data.privacy_level === 'string') {
            data.privacy_level = StageInstancePrivacyLevel[data.privacy_level];
        }

        const stageInstance = await this.client.rest.post<APIStageInstance>('/stage-instances', {
            body: data,
        });

        return this.cache._add(stageInstance.id, new StageInstance(this.client, stageInstance));
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/stage-instances/${id}`, { reason: reason as string });
        this.cache.delete(id);
    }

    public async edit(
        id: Snowflake,
        data: EditStageInstanceData,
        reason?: string
    ): Promise<StageInstance> {
        if (typeof data.privacy_level === 'string') {
            data.privacy_level = StageInstancePrivacyLevel[data.privacy_level];
        }

        const stageInstance = await this.client.rest.patch<APIStageInstance>(
            `/stage-instances/${id}`,
            {
                body: data,
                reason: reason as string,
            }
        );

        let _stageInstance = this.cache.get(id)!;

        if (_stageInstance) {
            _stageInstance = _stageInstance._patch(stageInstance);
        }

        return this.cache._add(
            stageInstance.id,
            _stageInstance ?? new StageInstance(this.client, stageInstance)
        );
    }
}
