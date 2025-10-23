import {
  CreateAorTemplateRequest,
  CreateAorTemplateResponse,
  FetchAorFormsResponse,
  FetchAorsWithTemplateResponse,
  FetchAorUsersResponse,
  FormTemplateResponseDto,
} from "../types/aorForm.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchAorForms = (params: {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params.search) query.append("search", params.search);

  return api.get<FetchAorFormsResponse>(
    `${API_ENDPOINTS.AOR_FORMS}?${query.toString()}`,
  );
};

export const deleteAorForm = (id: string) =>
  api.delete<{ message: string }>(`${API_ENDPOINTS.AOR_FORMS_ACTION}/${id}`);

export const fetchAorsWithTemplate = () =>
  api.get<FetchAorsWithTemplateResponse>(API_ENDPOINTS.AOR_TEMPLATE);

export const createAorTemplate = (payload: CreateAorTemplateRequest) =>
  api.post<CreateAorTemplateResponse>(
    `${API_ENDPOINTS.AOR_FORMS_ACTION}`,
    payload,
  );

export const fetchFormTemplateById = async (
  id: string,
): Promise<FormTemplateResponseDto> => {
  const response = await api.get<FormTemplateResponseDto>(
    `${API_ENDPOINTS.AOR_FORMS_ACTION}/${id}`,
  );
  return response.data;
};

export const editAorTemplate = (
  id: string,
  payload: CreateAorTemplateRequest,
) =>
  api.put<CreateAorTemplateResponse>(
    `${API_ENDPOINTS.AOR_FORMS_ACTION}/${id}`,
    payload,
  );


export const fetchAorUserById = (id: string) =>
  api.get<FetchAorUsersResponse>(`${API_ENDPOINTS.AOR_USERS}/${id}`);
