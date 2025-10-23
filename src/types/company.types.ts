export interface Company {
  _id: string;
  name: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CompanyListResponse {
  message: string;
  data: {
    data: Company[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface AddCompanyRequestDto {
  name: string;
  isActive?: boolean;
}

export interface AddCompanyResponseDto {
  message: string;
  data: Company;
}