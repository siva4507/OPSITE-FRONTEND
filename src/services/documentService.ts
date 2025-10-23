import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  FetchUserFoldersResponse,
  RenameFolderResponse,
  DeleteFolderResponse,
  CreateFolderResponse,
  CreateFolderRequest,
  UploadFileResponse,
} from "@/src/dto/document.dto";

export const fetchUserFolders = async (
  id?: string,
  page?: number,
  recent?: boolean,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
): Promise<FetchUserFoldersResponse> => {
  let endpoint = id
    ? `${API_ENDPOINTS.USER_FOLDERS}/${id}`
    : API_ENDPOINTS.USER_FOLDERS;
  const params = [];
  if (page) params.push(`page=${page}`);
  if (recent) params.push(`recent=true`);
  if (sortBy) params.push(`sortBy=${sortBy}`);
  if (sortOrder) params.push(`sortOrder=${sortOrder}`);
  if (params.length > 0) endpoint += `?${params.join("&")}`;
  const response = await api.get(endpoint);
  return response.data;
};

export const fetchUserFoldersSearch = async (
  search: string,
  id?: string,
  page?: number,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
): Promise<FetchUserFoldersResponse> => {
  let endpoint = id
    ? `${API_ENDPOINTS.USER_FOLDERS}/${id}`
    : API_ENDPOINTS.USER_FOLDERS;
  const params = [];
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (page) params.push(`page=${page}`);
  if (sortBy) params.push(`sortBy=${sortBy}`);
  if (sortOrder) params.push(`sortOrder=${sortOrder}`);
  if (params.length > 0) endpoint += `?${params.join("&")}`;
  const response = await api.get(endpoint);
  return response.data;
};

export const renameFolder = async (
  id: string,
  name: string,
): Promise<RenameFolderResponse> => {
  const response = await api.patch(`${API_ENDPOINTS.RENAME_FOLDER}/${id}`, {
    name,
  });
  return response.data;
};

export const deleteFolder = async (
  id: string,
): Promise<DeleteFolderResponse> => {
  const response = await api.delete(`${API_ENDPOINTS.RENAME_FOLDER}/${id}`);
  return response.data;
};

export const createFolder = async (
  data: CreateFolderRequest,
): Promise<CreateFolderResponse> => {
  const response = await api.post(API_ENDPOINTS.RENAME_FOLDER, data);
  return response.data;
};

export const uploadFile = async ({
  file,
  tags,
  parentId,
}: {
  file: File;
  tags: string[];
  parentId?: string;
}): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  tags.forEach((tag) => formData.append("tags", tag));
  if (parentId) formData.append("parentId", parentId);
  const response = await api.post(API_ENDPOINTS.UPLOAD_FILES, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
