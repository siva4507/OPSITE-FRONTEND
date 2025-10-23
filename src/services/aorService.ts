import {
  AddAorRequest,
  AddAorResponse,
  CityResponse,
  StateResponse,
  TimezoneResponse,
} from "../types/aor.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchAor = (params?: {
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

  return api.get(`${API_ENDPOINTS.FETCH_AOR}?${query.toString()}`);
};

export const addAor = (data: AddAorRequest) =>
  api.post(API_ENDPOINTS.FETCH_AOR, data);

export const updateAor = (id: string, payload: AddAorRequest) =>
  api.put<AddAorResponse>(`${API_ENDPOINTS.FETCH_AOR}/${id}`, payload);

export const deleteAor = async (id: string): Promise<void> =>
  api.delete(`${API_ENDPOINTS.FETCH_AOR}/${id}`);

export const fetchStates = () => api.get<StateResponse[]>(API_ENDPOINTS.STATES);

export const fetchCitiesByState = (stateId: string) =>
  api.get<CityResponse[]>(`${API_ENDPOINTS.CITIES}/${stateId}`);

export const fetchTimezones = () =>
  api.get<TimezoneResponse[]>(API_ENDPOINTS.TIMEZONES);
