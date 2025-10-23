// src/services/shiftHoursService.ts
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  ShiftHoursRequestDto,
  ShiftHoursResponseDto,
  ShiftHoursListResponseDto,
} from "@/src/types/shiftHours.types";

/**
 * Fetch all Shift Hours (with optional search, pagination, sorting)
 */
export const fetchShiftHours = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ShiftHoursListResponseDto> => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const response = await api.get<ShiftHoursListResponseDto>(
    `${API_ENDPOINTS.SHIFT_HOURS}?${query.toString()}`,
  );
  return response.data;
};

/**
 * Add a new Shift Hours entry
 */
export const addShiftHours = async (
  payload: ShiftHoursRequestDto,
): Promise<ShiftHoursResponseDto> => {
  const response = await api.post<ShiftHoursResponseDto>(
    API_ENDPOINTS.SHIFT_HOURS,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing Shift Hours entry
 */
export const editShiftHours = async (
  shiftHoursId: string,
  payload: ShiftHoursRequestDto,
): Promise<ShiftHoursResponseDto> => {
  const response = await api.put<ShiftHoursResponseDto>(
    `${API_ENDPOINTS.SHIFT_HOURS}/${shiftHoursId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a Shift Hours entry
 */
export const deleteShiftHours = async (
  shiftHoursId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.SHIFT_HOURS}/${shiftHoursId}`,
  );
  return response.data;
};
