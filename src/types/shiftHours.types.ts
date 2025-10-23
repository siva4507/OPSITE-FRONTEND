// src/types/shiftHours.types.ts

export interface ShiftHours {
  _id: string;
  hours: number;
  credit: number;
  createdBy?: string;
  createdByName?: string; // optional, present in list
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: unknown;
}

export interface ShiftHoursRequestDto {
  hours: number;
  credit: number;
}

export interface ShiftHoursResponseDto {
  message: string;
  data: ShiftHours;
}

export interface ShiftHoursListResponseDto {
  data: {
    data: ShiftHours[]; // array of shift hours
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ShiftHoursState {
  shiftHours: ShiftHours[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
