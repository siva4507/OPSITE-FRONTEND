import {
  AddRoleRequest,
  FetchRolesParams,
  FetchRolesResponse,
  RoleResponse,
} from "../types/role.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

/**
 * Fetch list of roles with optional sorting, searching, and pagination
 * @param params - query parameters
 * @returns list of roles with pagination info
 */
export const fetchRoles = (params?: FetchRolesParams) => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get<FetchRolesResponse>(
    `${API_ENDPOINTS.ROLE}?${query.toString()}`,
  );
};

/**
 * Add a new role
 * @param payload - Role data
 * @returns Created role
 */
export const addRole = async (
  payload: AddRoleRequest,
): Promise<RoleResponse> => {
  const response = await api.post<RoleResponse>(API_ENDPOINTS.ROLE, payload);
  return response.data;
};

/**
 * Edit an existing role
 * @param roleId - ID of the role to update
 * @param payload - Data to update
 * @returns Updated role
 */
export const editRole = async (
  roleId: string,
  payload: AddRoleRequest,
): Promise<RoleResponse> => {
  const response = await api.put<RoleResponse>(
    `${API_ENDPOINTS.ROLE}/${roleId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete an existing role
 * @param roleId - ID of the role to delete
 * @returns Success message
 */
export const deleteRole = async (
  roleId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.ROLE}/${roleId}`,
  );
  return response.data;
};