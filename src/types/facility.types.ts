export interface AddFacilityRequestDto {
  facilityNames: string;
  aorId: string;
  companyId: string;
}

export interface FacilityResponseItem {
  name: string;
  createdBy: string;
  aorId: string;
  companyId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddFacilityResponseDto {
  _id: string;
  message: string;
  data: FacilityResponseItem[];
}

export interface AddFacilityResponseDtoNew {
  message: string;
  data: {
    name: string;
    createdBy: string;
    aorId: string;
    companyId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface Facility {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  createdByName?: string;
  aorName: string;
  aorId?: string;
  companyId?: string;
  companyName?: string;
  [key: string]: unknown;
}

export interface FacilityByAorIdResponseItem {
  _id: string;
  name: string;
  aorId: string;
  createdAt: string;
  updatedAt: string;
  aorName: string;
}

export interface FacilityResponse {
  data: Facility[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FacilityState {
  facilities: Facility[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  loading: boolean;
  error: string | null;
}

export interface FacilityImportSuccess {
  row: number;
  facilityIds: string[];
  facilityNames: string;
}

export interface FacilityImportFailed {
  row: number;
  error: string;
  facilityNames: string;
  reasons: string[];
}

export interface FacilityImportResponse {
  successCount: number;
  failedCount: number;
  success: FacilityImportSuccess[];
  failed: FacilityImportFailed[];
}

export interface CompanyResponseDto {
  message: string;
  data: Company[];
}

export interface Company {
  _id: string;
  name: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
