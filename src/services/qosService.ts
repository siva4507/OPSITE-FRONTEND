// services/qos.service.ts
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  AddQOSRequestDto,
  QOSResponseDto,
  QOSListResponseDto,
} from "@/src/types/qos.types";

/**
 * Fetch paginated Quality of Sleep list
 */
export const fetchQOS = async (params?: {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<QOSListResponseDto> => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const response = await api.get<QOSListResponseDto>(
    `${API_ENDPOINTS.QOS}?${query.toString()}`,
  );
  return response.data;
};

/**
 * Add a new Quality of Sleep entry
 */
export const addQOS = async (
  payload: AddQOSRequestDto,
): Promise<QOSResponseDto> => {
  const response = await api.post<QOSResponseDto>(API_ENDPOINTS.QOS, payload);
  return response.data;
};

/**
 * Edit an existing Quality of Sleep entry
 */
export const editQOS = async (
  qosId: string,
  payload: AddQOSRequestDto,
): Promise<QOSResponseDto> => {
  const response = await api.put<QOSResponseDto>(
    `${API_ENDPOINTS.QOS}/${qosId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a Quality of Sleep entry
 */
export const deleteQOS = async (
  qosId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.QOS}/${qosId}`,
  );
  return response.data;
};
