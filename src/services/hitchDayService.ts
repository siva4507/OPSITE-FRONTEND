// src/services/hitchDayService.ts
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  HitchDayRequestDto,
  HitchDayResponseDto,
  HitchDayListResponseDto,
} from "@/src/types/hitchDay.types";

/**
 * Fetch all Hitch Day Offsets (with optional search, pagination, sorting)
 */
export const fetchHitchDays = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}): Promise<HitchDayListResponseDto> => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  const response = await api.get<HitchDayListResponseDto>(
    `${API_ENDPOINTS.HITCH_DAY}?${query.toString()}`,
  );
  return response.data;
};

/**
 * Add a new Hitch Day Offset
 */
export const addHitchDay = async (
  payload: HitchDayRequestDto,
): Promise<HitchDayResponseDto> => {
  const response = await api.post<HitchDayResponseDto>(
    API_ENDPOINTS.HITCH_DAY,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing Hitch Day Offset
 */
export const editHitchDay = async (
  hitchDayId: string,
  payload: HitchDayRequestDto,
): Promise<HitchDayResponseDto> => {
  const response = await api.put<HitchDayResponseDto>(
    `${API_ENDPOINTS.HITCH_DAY}/${hitchDayId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a Hitch Day Offset
 */
export const deleteHitchDay = async (
  hitchDayId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.HITCH_DAY}/${hitchDayId}`,
  );
  return response.data;
};
