import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  AddCategoryRequestDto,
  CategoryResponseDto,
} from "@/src/types/category.types";

export const fetchCategories = (params?: {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get(`${API_ENDPOINTS.CATEGORY}?${query.toString()}`);
};

export const addCategory = async (
  payload: AddCategoryRequestDto,
): Promise<CategoryResponseDto> => {
  const response = await api.post<CategoryResponseDto>(
    API_ENDPOINTS.CATEGORY,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing category
 * @param categoryId - ID of the category to update
 * @param payload - Data to update the category
 * @returns Updated category data
 */
export const editCategory = async (
  categoryId: string,
  payload: AddCategoryRequestDto,
): Promise<CategoryResponseDto> => {
  const response = await api.put<CategoryResponseDto>(
    `${API_ENDPOINTS.CATEGORY}/${categoryId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete an existing category
 * @param categoryId - ID of the category to delete
 * @returns Success message
 */
export const deleteCategory = async (
  categoryId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.CATEGORY}/${categoryId}`,
  );
  return response.data;
};
