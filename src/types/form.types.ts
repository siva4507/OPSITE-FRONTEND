import { SelectChangeEvent } from "@mui/material/Select";

export interface FieldConfig {
  label?: string;
  name: string;
  type: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  extents?: FieldConfig[];
  alignment?: string;
  order?: number;
  extentsdefault?: number;
  extentstrigger?: { options?: string[] };
  description?: string;
}

export interface Group {
  title?: string;
  fields: FieldConfig[];
  description?: string;
  alignment?: string;
}

export interface FormBuilderProps {
  fields: FieldConfig[];
  title?: string;
  description?: string;
  groups?: Group[];
  showErrors?: boolean;
  fieldErrors?: {
    [mainFieldName: string]: {
      main?: boolean;
      extents?: { [extentName: string]: boolean };
    };
  };
  onFormValueChange?: (fieldName: string, value: unknown) => void;
}

export interface FormValues {
  [key: string]: unknown;
}

export interface FormValuesContextProps {
  values: FormValues;
  setValue: (name: string, value: unknown) => void;
  reset: () => void;
  lastFocusedField: string | null;
  applySpeechTranscript: (transcript: string) => void;
}

export interface FormValuesProviderProps {
  children: React.ReactNode;
  initialValues?: { [fieldName: string]: unknown };
  onValueChange?: (fieldName: string, value: unknown) => void;
}

export interface CheckboxInputProps {
  label?: string;
  name: string;
  value: string[];
  options: string[];
  onChange: (option: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export interface DateInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  readOnlyPreview?: boolean;
}

export interface RadioInputProps {
  label?: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.MouseEvent<HTMLElement>, value: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export interface TextAreaInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  name: string;
  rows?: number;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  error?: boolean;
  helperText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}

export interface TimeInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  readOnlyPreview?: boolean;
}

export interface ESignInputProps {
  value?: string;
  onChange: (e: { target: { value: string } }) => void;
  name: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  label?: string;
  name: string;
  value: string;
  options: Array<{ label: string; value: string }> | string[];
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
}

export interface NestedFieldErrors {
  [mainFieldName: string]: {
    main?: boolean;
    extents?: { [extentName: string]: boolean };
  };
}

export interface NestFieldErrors {
  [stepKey: string]: {
    [mainFieldName: string]: {
      main?: boolean;
      extents?: { [extentName: string]: boolean };
    };
  };
}
