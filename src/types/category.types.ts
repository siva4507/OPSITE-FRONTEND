// Types
export interface Category {
  _id: string;
  name: string;
  createdBy: string;
  __v: number;
  createdByName?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CategoryState {
  categories: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface AddCategoryRequestDto {
  name: string;
}

export interface CategoryResponseDto {
  message: string;
  data: {
    _id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
