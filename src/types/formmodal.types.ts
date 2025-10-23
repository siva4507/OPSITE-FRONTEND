export interface BaseFieldProps {
  name: string;
  label?: string;
  value: unknown;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxlength?: number;
  onChange: (name: string, value: unknown) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export interface OptionType {
  value: string;
  label: string;
  disabled?: boolean;
}
