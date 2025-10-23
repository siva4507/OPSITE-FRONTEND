// types/qos.types.ts

export interface QOS {
  _id: string;
  quality: string;
  rating: string;
  credit: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: unknown;
}

export interface AddQOSRequestDto {
  quality: string;
  rating: string;
  credit: number;
}

export interface QOSResponseDto {
  message: string;
  data: QOS;
}

export interface QOSListResponseDto {
  message: string;
  data: {
    data: QOS[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
