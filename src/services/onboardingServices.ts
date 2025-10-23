import api from "./api";
import {
  RolesApiResponse,
  AreasOfResponsibilityApiResponse,
  QualityOfSleepResponse,
  ControllerUserApiResponse,
  ShiftAssignmentData,
  CompanyListApiResponse,
  UploadSignatureResponse,
} from "@/src/dto/onboarding.dto";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import { AxiosError } from "axios";

export const getRoles = async (): Promise<RolesApiResponse> => {
  const res = await api.get(API_ENDPOINTS.ROLES);
  return res.data;
};

export const getAreasOfResponsibility = async (
  companyIds: string[],
): Promise<AreasOfResponsibilityApiResponse> => {
  const res = await api.post(API_ENDPOINTS.AOR, { companyIds });
  return res.data;
};

export const getQualityOfSleep = async (): Promise<QualityOfSleepResponse> => {
  const res = await api.get(API_ENDPOINTS.QUALITY_OF_SLEEP);
  return res.data;
};

export const getControllerUsers =
  async (): Promise<ControllerUserApiResponse> => {
    const res = await api.get(API_ENDPOINTS.ACTIVE_CONTROLLERS);
    return res.data;
  };

export const assignShift = async (data: ShiftAssignmentData) => {
  try {
    const res = await api.post(API_ENDPOINTS.ASSIGN_SHIFT, data);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    throw {
      message: axiosError.response?.data?.message || "Failed to assign shift",
      statusCode: axiosError.response?.status,
    };
  }
};

export const getCompanies = async (): Promise<CompanyListApiResponse> => {
  const res = await api.get(API_ENDPOINTS.COMPANY);
  return res.data;
};

export const uploadSignature = async (
  signature: File,
): Promise<UploadSignatureResponse> => {
  const formData = new FormData();
  formData.append("signature", signature);
  const res = await api.post(API_ENDPOINTS.UPLOAD_SIGNATURE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const logoutt = async (): Promise<void> => {
  const res = await api.post(API_ENDPOINTS.LOGOUT);
  return res.data;
};

export const impersonateUser = async (userId: string) => {
  try {
    const res = await api.post(`${API_ENDPOINTS.IMPERSONATE}/${userId}`);
    return res.data as { token: string };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    throw {
      message:
        axiosError.response?.data?.message || "Failed to impersonate user",
      statusCode: axiosError.response?.status,
    };
  }
};