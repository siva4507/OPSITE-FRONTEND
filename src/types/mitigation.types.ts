export interface MitigationRequestDto {
  name: string;
  credit: number;
}

export interface MitigationResponseDto {
  message: string;
  data: {
    _id: string;
    name: string;
    type: string;
    credit: number;
    createdBy: string;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface MitigationListResponseDto {
  message: string;
  data: {
    data: MitigationResponseDto["data"][];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface Mitigation {
  _id: string;
  name: string;
  credit: number;
  type: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: unknown;
}

export interface MitigationRequestDto {
  name: string;
  credit: number;
  type: string;
}

export interface MitigationState {
  mitigations: Mitigation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
