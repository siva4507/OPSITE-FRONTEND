import { User } from "@/src/types/auth.types";

export interface AppbarProps {
  userName: string;
  profileUrl?: string;
}

export interface authSectionProps {
  words: string[];
  caption: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "select"
    | "time"
    | "multiselect"
    | "textarea"
    | "tags"
    | "checkbox"
    | "file"
    | "color"
    | "password"
    | "autocomplete"
    | "number"
    | "phone"
    | "email"
    | "time";
  required?: boolean;
  options?: { label: string; value: string; disabled?: boolean }[];
  placeholder?: string;
  disabledOptions?: string[];
  disabled?: boolean;
  maxSelected?: number;
  maxlength?: number | undefined;
  accept?: string;
  maxFileSizeMB?: number;
  fileButton?: (hasFile: boolean) => React.ReactNode;
  previewUrl?: string | null;
  min?: number;
  max?: number;
  step?: number;
  loading?: boolean;
}

export interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  onFormValueChange?: (fieldName: string, value: unknown) => void;
  initialValues?: Record<string, unknown>;
  onAutocompleteInputChange?: (fieldName: string, inputValue: string) => void;
  disabled?: boolean;
}

export enum AlertType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

export interface AlertState {
  open: boolean;
  message: string;
  type: AlertType;
}

export interface IconMapperProps {
  icon?: string;
  fontSize?: "inherit" | "small" | "medium" | "large";
  color?: string;
}

export interface DynamicModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number | string;
}

export interface PasswordProps {
  password: string;
  confirmPassword: string;
}

export interface I18nProviderProps {
  children: React.ReactNode;
}

export interface ReduxProviderProps {
  children: React.ReactNode;
}

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  mode: ThemeMode;
}

export type DashboardLayoutProps = {
  children: React.ReactNode;
};

export interface SpeechContextProps {
  applyTranscript: (transcript: string) => void;
  setTranscriptHandler: (handler: (transcript: string) => void) => void;
  hasHandler: () => boolean;
  registerGlobalHandler: (handler: (transcript: string) => void) => void;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
  allowedRoles?: string[];
}

export interface DashboardHeaderProps {
  onOpenBgPicker: () => void;
  onNotifyOpen: () => void;
}

export interface BackgroundImagePickerProps {
  open: boolean;
  onClose: () => void;
  onLivePreview: (theme: {
    imageUrl?: string;
    colorCode?: string;
    opacity?: number;
  }) => void;
  onApply: (theme: {
    imageUrl?: string;
    colorCode?: string;
    opacity?: number;
  }) => void;
  userTheme: Partial<User["theme"]>;
}

export interface ThemeConfig {
  imageUrl: string;
  colorCode: string;
  opacity: number;
}

export interface FileInputProps {
  onChange: (file: File | null) => void;
  onValidationError: (error: string) => void;
  accept?: string;
  maxFileSizeMB?: number;
  value?: File | null;
  button?: (fileSelected: boolean) => React.ReactNode;
  previewUrl?: string | null; // <--- add this
  initialFileName?: string;
  imageResolution?: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
}

export interface ThemeApiResponse {
  imageUrl?: string;
  colorCode?: string;
  opacity?: number;
  isSelected?: "custom" | "systemtheme";
  theme?: {
    _id: string;
    colorCode: string;
    opacity: number;
  };
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number, limit: number) => void;
  showPagination: boolean;
}

export interface HeaderConfig<T> {
  label: string;
  field: keyof T & string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  renderType?: "tags" | "status";
  sortKey?: string;
  exportValue?: (row: T) => string;
  maxLength?: number;
}

export interface ActionConfig<T> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}

export interface DynamicTableProps<T extends Record<string, unknown>> {
  headers: HeaderConfig<T>[];
  rows: T[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: keyof T & string) => void;
  actions?: ActionConfig<T>[];
  noDataMessage?: string;
  styles?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: T) => void;
  onExport?: (exportFn: (exportType?: "csv" | "xlsx") => void) => void;
  onToggleImportant?: (rowId: string) => void;
  loading?: boolean;
}

export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export type OptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type WeatherIcon =
  | "01d"
  | "01n"
  | "02d"
  | "02n"
  | "03d"
  | "03n"
  | "04d"
  | "04n"
  | "09d"
  | "09n"
  | "10d"
  | "10n"
  | "11d"
  | "11n"
  | "13d"
  | "13n"
  | "50d"
  | "50n";
