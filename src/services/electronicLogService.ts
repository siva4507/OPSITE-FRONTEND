import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  AssignedAORsResponse,
  Category,
  LogEntrySavePayload,
  LogEntrySaveResponse,
  LogEntryUpdatePayload,
} from "@/src/dto/electronicLog.dto";

export const fetchAssignedAORs = async (): Promise<AssignedAORsResponse> => {
  const response = await api.get(API_ENDPOINTS.ASSIGNED_AORS);
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get(API_ENDPOINTS.CATEGORIES);
  return response.data;
};

export const saveLogEntries = async (
  payload: LogEntrySavePayload[],
  files: File[],
): Promise<LogEntrySaveResponse> => {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  files.forEach((file, idx) => {
    if (file) {
      formData.append(`file${idx + 1}`, file, file.name);
    }
  });
  const response = await api.post(API_ENDPOINTS.SAVE_LOG, formData);
  return response.data;
};

export const fetchLogEntriesByAor = (
  shiftAorId: string,
  params?: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    filter?: string;
    page?: number;
    limit?: number;
  },
) => {
  const query = new URLSearchParams();
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.filter) query.append("filter", params.filter);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get(
    `${API_ENDPOINTS.FETCH_LOG}/${shiftAorId}?${query.toString()}`,
  );
};

export const toggleImportantLogEntry = async (rowId: string) => {
  const response = await api.patch(`${API_ENDPOINTS.MARK_IMP}/${rowId}`);
  return response.data;
};

export const deleteLogEntry = (logEntryId: string) =>
  api.delete(`${API_ENDPOINTS.DELETE_LOG}/${logEntryId}`);

export const updateLogEntry = async (
  logId: string,
  payload: LogEntryUpdatePayload,
  files: File[],
): Promise<LogEntrySaveResponse> => {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  files.forEach((file, idx) => {
    if (file) {
      formData.append(`file${idx + 1}`, file, file.name);
    }
  });

  const response = await api.put(
    `${API_ENDPOINTS.UPDATE_LOG}/${logId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const exportLogbookPdf = async (
  aorId: string,
  params?: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    filter?: string;
    page?: number;
    limit?: number;
    userTimeZone?: string;
  },
): Promise<Blob> => {
  const query = new URLSearchParams();
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.filter) query.append("filter", params.filter);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.userTimeZone) query.append("userTimeZone", params.userTimeZone);

  const response = await api.get(
    `${API_ENDPOINTS.LOGBOOK_EXPORT_PDF}/${aorId}?${query.toString()}`,
    {
      responseType: "blob",
    },
  );

  return response.data;
};
