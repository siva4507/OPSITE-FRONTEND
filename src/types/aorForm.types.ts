export interface AorForm {
  _id: string;
  aorId: string;
  aorName: string;
  title: string;
  version: number;
  description: string;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: unknown;
}

export interface FetchAorFormsResponse {
  message: string;
  data: {
    data: AorForm[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface AorWithTemplate {
  _id: string;
  name: string;
}

export interface FetchAorsWithTemplateResponse {
  message: string;
  data: AorWithTemplate[];
}

export interface CreateAorTemplateRequest {
  aorId: string;
  title: string;
  version: number;
  description?: string;
  formTemplate: Record<string, any>; // flexible object
}

export interface CreateAorTemplateResponse {
  message: string;
  data: {
    _id: string;
    aorId: string;
    title: string;
    version: number;
    description?: string;
    formTemplate: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  };
}

export interface FormTemplateResponseDto {
  message: string;
  data: FormTemplate;
}

export interface FormTemplate {
  _id: string;
  aorId: string;
  title: string;
  version: number;
  description?: string;
  formTemplate: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AorUser {
  _id: string;
  username: string;
  email: string;
}

export interface FetchAorUsersResponse {
  message: string;
  data: AorUser[];
}