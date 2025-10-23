export interface FatigueScore {
  _id: string;
  minScore: number;
  maxScore: number;
  riskLevel: string;
  action: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  createdByName?: string;
  __v?: number;
  [key: string]: unknown;
}

export interface FatigueScoreResponseDto {
  message: string;
  data: {
    data: FatigueScore[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface FatigueScoreRequestParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  page?: number;
  limit?: number;
}

export interface AddFatigueScoreRequestDto {
  minScore: number;
  maxScore: number;
  riskLevel: string;
  action: string;
  color: string;
}

export interface EditFatigueScoreRequestDto extends AddFatigueScoreRequestDto {}

export interface FatigueScoreState {
  scores: FatigueScore[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
