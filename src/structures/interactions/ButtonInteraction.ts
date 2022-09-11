import type { Client, APIMessageComponentButtonInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class ButtonInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIMessageComponentButtonInteraction) {
        super(client, data);
    }
}
