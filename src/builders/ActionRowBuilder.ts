import { AnyComponent, ComponentType, type APIAnyComponent } from '../index';

import { BaseBuilder } from './BaseBuilder';

export class ActionRowBuilder extends BaseBuilder {
    public type: 1 = ComponentType.ActionRow;
    public components: (APIAnyComponent | AnyComponent)[];

    public constructor(components?: APIAnyComponent[]) {
        super();

        this.components = components ?? [];
    }

    public setComponents(...components: (APIAnyComponent | AnyComponent)[]) {
        return this.set('components', components);
    }

    public addComponents(...components: (APIAnyComponent | AnyComponent)[]) {
        for (const component of components) {
            this.components.push(component);
        }

        return this;
    }

    public removeComponents(...components: (APIAnyComponent | AnyComponent)[]) {
        for (const component of components) {
            const index = this.components.indexOf(component);

            if (index > -1) {
                this.components.splice(index, 1);
            }
        }

        return this;
    }
}
