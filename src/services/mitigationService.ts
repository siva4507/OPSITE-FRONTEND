import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  MitigationRequestDto,
  MitigationResponseDto,
  MitigationListResponseDto,
} from "@/src/types/mitigation.types";

/**
 * Fetch fatigue mitigations (with optional filters: search, pagination, sorting)
 */
export const fetchMitigations = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const query = new URLSearchParams();

  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

  return api.get<MitigationListResponseDto>(
    `${API_ENDPOINTS.MITIGATION}?${query.toString()}`,
  );
};

/**
 * Add a new fatigue mitigation
 */
export const addMitigation = async (
  payload: MitigationRequestDto,
): Promise<MitigationResponseDto> => {
  const response = await api.post<MitigationResponseDto>(
    API_ENDPOINTS.MITIGATION,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing fatigue mitigation
 */
export const editMitigation = async (
  mitigationId: string,
  payload: MitigationRequestDto,
): Promise<MitigationResponseDto> => {
  const response = await api.put<MitigationResponseDto>(
    `${API_ENDPOINTS.MITIGATION}/${mitigationId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a fatigue mitigation
 */
export const deleteMitigation = async (
  mitigationId: string,
): Promise<{ message: string; data: { deleted: boolean } }> => {
  const response = await api.delete<{
    message: string;
    data: { deleted: boolean };
  }>(`${API_ENDPOINTS.MITIGATION}/${mitigationId}`);
  return response.data;
};
