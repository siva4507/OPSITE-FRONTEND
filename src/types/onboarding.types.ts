export interface SelectedController {
  _id: string;
  username: string;
}

export enum OnboardingStep {
  RoleSelection = "roleSelection",
  HoursRest = "hoursRest",
  AreaResponse = "areaResponse",
  ActiveController = "activeController",
}

export interface OnboardingStepProps {
  currentStep: OnboardingStep;
  onNext: () => void;
  onBack: () => void;
}

export interface UploadSignatureResponse {
  message: string;
  data: {
    path: string;
  };
}
