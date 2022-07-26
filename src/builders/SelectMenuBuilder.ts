import {
    type APISelectMenuComponent,
    type SelectMenuOption,
    type APISelectMenuOption,
    EmojiResolver,
    ComponentType,
} from '../index';

import { BaseBuilder } from './BaseBuilder';

export class SelectMenuBuilder extends BaseBuilder {
    public disabled: boolean;
    public placeholder: string | null;
    public custom_id: string | null;
    public min_values: number;
    public max_values: number;
    public options: APISelectMenuOption[];
    public type: 3 = ComponentType.SelectMenu;

    public constructor(data?: APISelectMenuComponent) {
        super();

        this.disabled = data?.disabled ?? false;
        this.custom_id = data?.custom_id ?? null;
        this.placeholder = data?.placeholder ?? null;
        this.min_values = data?.min_values ?? 1;
        this.max_values = data?.max_values ?? 1;
        this.options = data?.options ?? [];
    }

    public setDisabled(disabled: boolean) {
        return this._change('disabled', disabled);
    }

    public setPlaceholder(placeholder: string) {
        return this._change('placeholder', placeholder);
    }

    public setCustomId(customId: string) {
        return this._change('custom_id', customId);
    }

    public setMinValues(minValues: number) {
        return this._change('min_values', minValues);
    }

    public setMaxValues(maxValues: number) {
        return this._change('max_values', maxValues);
    }

    public setOptions(...options: SelectMenuOption[]) {
        return this._change(
            'components',
            options.map((option) => {
                // @ts-ignore
                option.emoji &&= EmojiResolver(option.emoji);

                return option;
            })
        );
    }

    public addOptions(...options: SelectMenuOption[]) {
        for (const option of options) {
            // @ts-ignore
            option.emoji &&= EmojiResolver(option.emoji);

            this.options.push(option as APISelectMenuOption);
        }

        return this;
    }

    public removeOptions(...options: SelectMenuOption[]) {
        for (const option of options) {
            // @ts-ignore
            option.emoji &&= EmojiResolver(option.emoji);

            const index = this.options.indexOf(option as APISelectMenuOption);

            if (index > -1) {
                this.options.splice(index, 1);
            }
        }

        return this;
    }
}
