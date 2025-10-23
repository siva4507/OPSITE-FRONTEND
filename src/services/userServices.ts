import {
  FetchUsersParams,
  FetchUsersResponse,
  UserResponseDto,
  BulkImportResponse,
} from "../types/user.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchUsers = (params?: FetchUsersParams) => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get<FetchUsersResponse>(
    `${API_ENDPOINTS.FETCH_USERS}?${query.toString()}`,
  );
};

export const addUser = async (payload: FormData): Promise<UserResponseDto> => {
  const response = await api.post<{ message: string; data: UserResponseDto }>(
    API_ENDPOINTS.USER_ADD,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

export const editUser = async (
  userId: string,
  payload: FormData,
): Promise<UserResponseDto> => {
  const response = await api.put<{ message: string; data: UserResponseDto }>(
    `${API_ENDPOINTS.USER_ADD}/${userId}`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete<{
    message: string;
    data: { _id: string; username: string; email: string };
  }>(`${API_ENDPOINTS.USER_ADD}/${userId}`);
  return response.data.data;
};

export const importUsers = async (
  payload: FormData,
): Promise<BulkImportResponse> => {
  const response = await api.post<{
    message: string;
    data: BulkImportResponse;
  }>(API_ENDPOINTS.USER_IMPORT, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};