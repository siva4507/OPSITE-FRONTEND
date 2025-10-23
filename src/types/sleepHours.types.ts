// src/types/sleepHours.types.ts

export interface SleepHours {
  _id: string;
  hours: number;
  credit: number;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: unknown;
}

export interface SleepHoursRequestDto {
  hours: number;
  credit: number;
}

export interface SleepHoursResponseDto {
  message: string;
  data: SleepHours;
}

export interface SleepHoursListResponseDto {
  message: string;
  data: {
    data: SleepHours[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface SleepHoursState {
  sleepHours: SleepHours[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}
