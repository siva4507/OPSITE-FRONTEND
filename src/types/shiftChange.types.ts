import { ShiftFormTemplateResponse } from "@/src/dto/shiftChange.dto";
import {
  ShiftAor,
  ActiveShift,
  ActiveShiftResponse,
} from "@/src/dto/shiftChange.dto";

export interface StepData {
  label: string;
  icon?: string;
}

export interface ShiftChangeHeaderProps {
  onShiftChange?: (shiftLabel: string) => void;
  onAorChange?: (aorId: string) => void;
  steps: StepData[];
  step: number;
  setStep: (step: number) => void;
  title?: string;
  description?: string;
  currentAorId?: string;
  isLoading?: boolean;
  onSaveForm?: () => void;
  disabledSaveButton?: boolean;
  sectionStatuses?: { [shiftAorId: string]: boolean[] };
  noFormTemplate?: boolean;
}

export interface ShiftChangeDynamicFormProps {
  aorId: string;
  step: number;
  template: ShiftFormTemplateResponse | null;
  loading: boolean;
  showErrors?: boolean;
  fieldErrors?: {
    [mainFieldName: string]: {
      main?: boolean;
      extents?: { [extentName: string]: boolean };
    };
  };
  initialFormValues: { [fieldName: string]: unknown };
  onFormValueChange: (fieldName: string, value: unknown) => void;
}

export interface ShiftChangeFormState {
  [aorId: string]: { [step: number]: { [fieldName: string]: unknown } };
}

export interface TabIndicesState {
  [aorId: string]: number;
}

export type { ShiftAor, ActiveShift, ActiveShiftResponse };

export interface AddAorModalProps {
  remainingAorSlots: number;
  onSuccess?: () => void;
}

export interface AOR {
  _id: string;
  name: string;
  description: string;
  companyId?: string;
  color?: string;
  code: string;
  dailyHosLimit: number;
  weeklyHosLimit: number;
  emailDistributionList: string[];
  isActive: boolean;
  isLocked: boolean;
  shiftAorId: string;
  shiftId: string;
  isActiveTab: boolean;
}

export interface ADDAOR {
  _id: string;
  name: string;
  description: string;
  code: string;
  dailyHosLimit: number;
  weeklyHosLimit: number;
  emailDistributionList: string[];
  isActive: boolean;
  isLocked: boolean;
  lockedByName?: string;
}
