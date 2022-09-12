import { APIModalInteractionResponseCallbackData, ActionRowBuilder } from '../index';

import { BaseBuilder } from './BaseBuilder';

export class ModalBuilder extends BaseBuilder {
    public components: ActionRowBuilder[];
    public custom_id: string | null;
    public title: string | null;

    public constructor(data?: APIModalInteractionResponseCallbackData) {
        super();

        this.components = [];
        this.custom_id = data?.custom_id ?? null;
        this.title = data?.title ?? null;

        if (data?.components) {
            for (const component of data.components) {
                this.components.push(new ActionRowBuilder().setComponents(...component.components));
            }
        }
    }

    public setComponents(...components: ActionRowBuilder[]) {
        return this.set('components', components);
    }

    public addComponents(...components: ActionRowBuilder[]) {
        return this.set('components', this.components.concat(components));
    }

    public setCustomId(customId: string) {
        return this.set('custom_id', customId);
    }

    public setTitle(title: string): this {
        return this.set('title', title);
    }
}
