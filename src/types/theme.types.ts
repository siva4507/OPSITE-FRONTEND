export interface Theme {
  _id: string;
  type: string;
  userId: string | null;
  name: string;
  bgImage: string;
  bgImageUrl?: string;
  colorCode: string;
  opacity: number;
  default: boolean;
  theme?: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: unknown;
}

export interface FetchThemesResponse {
  message: string;
  data: {
    data: Theme[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface FetchThemesParams {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AddThemeRequestDto {
  name: string;
  colorCode: string;
  opacity: string | number;
  background: File;
}

export interface ThemeResponseDto {
  type: string;
  userId: string | null;
  name: string;
  bgImage: string;
  colorCode: string;
  opacity: number;
  default: boolean;
  theme: any;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
