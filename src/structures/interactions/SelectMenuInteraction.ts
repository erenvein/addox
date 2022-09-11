import type { Client, APIMessageComponentSelectMenuInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class SelectMenuInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
        super(client, data);
    }
}
