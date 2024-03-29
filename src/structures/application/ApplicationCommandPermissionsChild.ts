import {
    Snowflake,
    APIApplicationCommandPermissionsChildData,
    ApplicationCommandPermissionType,
} from '../../index';

export class ApplicationCommandPermissionsChild {
    public id!: Snowflake;
    public permission!: boolean;
    public type!: keyof typeof ApplicationCommandPermissionType;

    public constructor(data: APIApplicationCommandPermissionsChildData) {
        this._patch(data);
    }

    public _patch(data: APIApplicationCommandPermissionsChildData) {
        this.id = data.id;
        this.permission = data.permission;
        this.type = ApplicationCommandPermissionType[
            data.type
        ] as keyof typeof ApplicationCommandPermissionType;

        return this;
    }
}
