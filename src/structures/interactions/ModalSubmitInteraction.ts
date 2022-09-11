import type { Client, APIModalSubmitInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class ModalSubmitInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIModalSubmitInteraction) {
        super(client, data);
    }
}
