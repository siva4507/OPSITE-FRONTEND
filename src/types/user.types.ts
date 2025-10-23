import { Aor } from "./aor.types";

export interface FetchUsersParams {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Define response type
export interface User {
  _id: string;
  username: string;
  phoneNumber?: string;
  address?: string;
  email: string;
  roles: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  status: boolean;
  isVerified: boolean;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  assignedAors: Aor[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  roleName: string;
  aorName: string | null;
  profileFileUrl: string | null;
  [key: string]: unknown;
}

export interface FetchUsersResponse {
  message: string;
  data: {
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface UserResponseDto {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  roles: { _id: string; name: string }[];
  status: boolean;
  address: string;
  assignedAors: { _id: string; name: string }[];
  profileFileUrl?: string;
}

export interface BulkImportSuccess {
  row: number;
  userId: string;
  email: string;
}

export interface BulkImportFailed {
  row: number;
  error: string;
  email: string;
  reasons: string[];
}

export interface BulkImportResponse {
  successCount: number;
  failedCount: number;
  success: BulkImportSuccess[];
  failed: BulkImportFailed[];
}
