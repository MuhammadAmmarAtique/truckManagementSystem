export interface ICustomFieldTemplate {
  id?: string | null;
  name: string;
  type: string;
  systemVisibility: string;
  driverVisibility: string;
  requiredStage?: string | null;
  replicate?: boolean;
}

export const FIELD_TYPES = ["Text", "Number", "Date", "Boolean"];
