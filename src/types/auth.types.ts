export enum UserRole {
  ActiveController = "Active Controller",
  Administrator = "Administrator",
  Observer = "Observer",
}

export interface Role {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
  roles: Role[];
  status: boolean;
  isVerified: boolean;
  signatureUrl: string;
  profileUrl: string | null;
  activeShiftCount?: number;
  assignedAors?: string[];
  theme?: {
    imageUrl?: string;
    colorCode?: string;
    opacity?: number;
    isSelected?: "custom" | "systemtheme";
    theme?: {
      _id: string;
      colorCode: string;
      opacity: number;
    };
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  step: "login" | "reset-password";
  isOnboardingCompleted: boolean;
  hasUploadedSignature: boolean;
  rememberMe: boolean;
  roles: string[];
  selectedRole: string | null;
  onRefetch: boolean;
}
