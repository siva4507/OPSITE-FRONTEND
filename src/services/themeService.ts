import api from "./api";
import { API_ENDPOINTS } from "../utils/endpoints";
import {
  AddThemeRequestDto,
  FetchThemesParams,
  ThemeResponseDto,
} from "@/src/types/theme.types";

export const fetchSystemThemes = async () => {
  const response = await api.get(API_ENDPOINTS.SYSTEM_THEMES);
  return response.data.data;
};

export type UpdateThemeApiPayload = {
  themeId?: string;
  bgImage?: string;
  colorCode: string;
  opacity: number;
};

export const updateUserTheme = async (payload: UpdateThemeApiPayload) => {
  const response = await api.post(API_ENDPOINTS.UPDATE_THEME, payload);
  return response.data;
};

export const uploadBackgroundImage = async (
  file: File,
  colorCode: string,
  opacity: number,
) => {
  const formData = new FormData();
  formData.append("background", file);
  formData.append("colorCode", colorCode);
  formData.append("opacity", String(opacity));
  const response = await api.post(API_ENDPOINTS.UPDATE_THEME, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchThemes = (params?: FetchThemesParams) => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get(`${API_ENDPOINTS.THEMES}?${query.toString()}`);
};

export const addTheme = async (
  payload: AddThemeRequestDto,
): Promise<ThemeResponseDto> => {
  const response = await api.post<{ message: string; data: ThemeResponseDto }>(
    API_ENDPOINTS.THEMES,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

/**
 * Edit an existing theme
 * @param themeId - ID of the theme to update
 * @param payload - FormData containing name, colorCode, opacity, background
 * @returns Updated theme data
 */
export const editTheme = async (themeId: string, payload: FormData) => {
  const response = await api.put(`${API_ENDPOINTS.THEMES}/${themeId}`, payload);
  return response.data;
};

/**
 * Delete an existing theme
 * @param themeId - ID of the theme to delete
 * @returns Success message
 */
export const deleteTheme = async (
  themeId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.THEMES}/${themeId}`,
  );
  return response.data;
};
