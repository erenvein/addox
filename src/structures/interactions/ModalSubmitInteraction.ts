import {
    Client,
    APIModalSubmitInteraction,
    ComponentType,
    ModalSubmitComponentsData,
    ModalValueManager,
} from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class ModalSubmitInteraction extends BaseInteraction {
    public customId!: string;
    public components!: ModalSubmitComponentsData[];
    public values!: ModalValueManager;

    public constructor(client: Client, data: APIModalSubmitInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIModalSubmitInteraction) {
        super._patch(data);

        this.customId = data.data.custom_id;
        this.components = [];

        if (data.data.components?.length) {
            for (const component of data.data.components) {
                this.components.push({
                    type: ComponentType[component.type] as keyof typeof ComponentType,
                    components: component.components.map((c) => {
                        return {
                            customId: c.custom_id,
                            type: ComponentType[c.type] as keyof typeof ComponentType,
                            value: c.value,
                        };
                    }),
                });
            }
        }

        this.values = new ModalValueManager(this.client, this.components);

        return this;
    }
}
