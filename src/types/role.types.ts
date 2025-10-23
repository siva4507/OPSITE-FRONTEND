export interface FetchRolesParams {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Role {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface FetchRolesResponse {
  message: string;
  data: {
    data: Role[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface AddRoleRequest {
  name: string;
}

export interface RoleResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}