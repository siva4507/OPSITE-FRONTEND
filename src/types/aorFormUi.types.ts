export type Alignment = "half" | "full";

export type FieldType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "date"
  | "esign"
  | "time"
  | "select";

export interface FieldConfig {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  alignment: Alignment;
  order?: number;

  options?: string[];

  extents?: FieldConfig[];
  extentsdefault?: string;
  extentstrigger?: { options?: string[] };
  value?: string;
  rows?: number;
}

export interface GroupConfig {
  id: string;
  title?: string;
  description?: string;
  alignment?: Alignment; // NEW
  fields: FieldConfig[];
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  order?: number;
  group: GroupConfig[];
  icon?: string;
}

export interface FormConfig {
  sections: SectionConfig[];
}
