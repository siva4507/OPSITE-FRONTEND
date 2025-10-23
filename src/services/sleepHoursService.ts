import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  SleepHoursRequestDto,
  SleepHoursResponseDto,
  SleepHoursListResponseDto,
} from "@/src/types/sleepHours.types";

/**
 * Fetch Continuous Sleep Hours (with optional filters: search, pagination, sorting)
 */
export const fetchSleepHours = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}): Promise<SleepHoursListResponseDto> => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const response = await api.get<SleepHoursListResponseDto>(
    `${API_ENDPOINTS.SLEEP_HOURS}?${query.toString()}`,
  );
  return response.data;
};

/**
 * Add a new Continuous Sleep Hours entry
 */
export const addSleepHours = async (
  payload: SleepHoursRequestDto,
): Promise<SleepHoursResponseDto> => {
  const response = await api.post<SleepHoursResponseDto>(
    API_ENDPOINTS.SLEEP_HOURS,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing Continuous Sleep Hours entry
 */
export const editSleepHours = async (
  sleepHoursId: string,
  payload: SleepHoursRequestDto,
): Promise<SleepHoursResponseDto> => {
  const response = await api.put<SleepHoursResponseDto>(
    `${API_ENDPOINTS.SLEEP_HOURS}/${sleepHoursId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a Continuous Sleep Hours entry
 */
export const deleteSleepHours = async (
  sleepHoursId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.SLEEP_HOURS}/${sleepHoursId}`,
  );
  return response.data;
};
