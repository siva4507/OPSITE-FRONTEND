import {
  AddFacilityRequestDto,
  AddFacilityResponseDto,
  CompanyResponseDto,
  FacilityImportResponse,
} from "../types/facility.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import { Aor } from "@/src/types/aor.types";

export const fetchFacilities = (params?: {
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

  return api.get(`${API_ENDPOINTS.FACILITIES}?${query.toString()}`);
};

export const addFacility = async (
  payload: AddFacilityRequestDto,
): Promise<AddFacilityResponseDto> => {
  const response = await api.post<AddFacilityResponseDto>(
    API_ENDPOINTS.FACILITIES,
    payload,
  );
  return response.data;
};

export const updateFacility = async (
  facilityId: string,
  payload: AddFacilityRequestDto,
): Promise<AddFacilityResponseDto> => {
  const response = await api.put<AddFacilityResponseDto>(
    `${API_ENDPOINTS.FACILITIES}/${facilityId}`,
    payload,
  );
  return response.data;
};

export const deleteFacility = async (facilityId: string): Promise<void> => {
  await api.delete(`${API_ENDPOINTS.FACILITIES}/${facilityId}`);
};

export const importFacility = async (
  payload: FormData,
): Promise<FacilityImportResponse> => {
  const response = await api.post<{
    message: string;
    data: FacilityImportResponse;
  }>(API_ENDPOINTS.FACILITY_IMPORT, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const getFacilitiesByAorId = async (
  aorId: string,
  search: string = "",
) => {
  const response = await api.get(`${API_ENDPOINTS.FACILITY_AOR}${aorId}`, {
    params: { search },
  });

  return response.data.data;
};

export const fetchFacilityCompanies = async (): Promise<CompanyResponseDto> => {
  const response = await api.get<CompanyResponseDto>(
    API_ENDPOINTS.FACILITY_COMPANY,
  );
  return response.data;
};

export const fetchAorsByCompany = async (
  companyId: string,
): Promise<{ message: string; data: Aor[] }> => {
  const response = await api.get<{ message: string; data: Aor[] }>(
    `${API_ENDPOINTS.FACILITY_COMPANY_AORS}${companyId}`,
  );
  return response.data;
};