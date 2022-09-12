import type { Client, APIMessageComponentSelectMenuInteraction } from '../../index';

import { BaseMessageComponentInteraction } from '../base/BaseMessageComponentInteraction';

export class SelectMenuInteraction extends BaseMessageComponentInteraction {
    public values!: string[];

    public constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIMessageComponentSelectMenuInteraction) {
        super._patch(data);

        this.values = data.data.values;

        return this;
    }
}
