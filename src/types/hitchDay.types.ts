export interface HitchDayRequestDto {
  day: string;
  credit: number;
}

export interface HitchDayResponseDto {
  message: string;
  data: HitchDay;
}

export interface HitchDayListResponseDto {
  message: string;
  data: {
    data: HitchDay[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface HitchDay {
  _id: string;
  day: string;
  credit: number;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
