export interface ICustomFieldGroupConfiguration {
  customFieldId?: string;
  customFieldName: string;
  systemVisibility: string;
  driverVisibility: string;
  requiredStage?: string | null;
  replicate?: boolean | null;
}

export interface ICustomFieldGroup {
  id?: string | null;
  name: string;
  customFields: ICustomFieldGroupConfiguration[];
}
