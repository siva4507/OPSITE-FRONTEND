import {
  AddCompanyRequestDto,
  AddCompanyResponseDto,
} from "../types/company.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchCompanies = (params?: {
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

  return api.get(`${API_ENDPOINTS.COMPANIES}?${query.toString()}`);
};

export const addCompany = async (
  payload: AddCompanyRequestDto,
): Promise<AddCompanyResponseDto> => {
  const response = await api.post<AddCompanyResponseDto>(
    API_ENDPOINTS.COMPANIES,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing company
 * @param companyId - ID of the company to update
 * @param payload - Data to update (name, isActive)
 * @returns Updated company data
 */
export const editCompany = async (
  companyId: string,
  payload: AddCompanyRequestDto,
): Promise<AddCompanyResponseDto> => {
  const response = await api.put<AddCompanyResponseDto>(
    `${API_ENDPOINTS.COMPANIES}/${companyId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete an existing company
 * @param companyId - ID of the company to delete
 * @returns Success message
 */
export const deleteCompany = async (
  companyId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.COMPANIES}/${companyId}`,
  );
  return response.data;
};
