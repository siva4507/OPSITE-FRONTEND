import { API_ENDPOINTS } from "@/src/utils/endpoints";
import api from "./api";
import {
  ActiveShiftApiResponse,
  EndShiftResponse,
} from "@/src/dto/shiftChange.dto";
import { ShiftFormTemplateApiResponse } from "@/src/dto/shiftChange.dto";

export const getActiveShifts = async (): Promise<ActiveShiftApiResponse> => {
  const res = await api.get(API_ENDPOINTS.SHIFT_ACTIVE);
  return res.data;
};

export const getShiftFormTemplate = async (
  shiftAorId: string,
): Promise<ShiftFormTemplateApiResponse> => {
  const res = await api.get(
    `${API_ENDPOINTS.SHIFT_FORM_TEMPLATE}/${shiftAorId}`,
  );
  return res.data;
};

export const saveShiftValues = <T>(data: T, completed?: boolean) => {
  const url = completed
    ? `${API_ENDPOINTS.SAVESHIFTVALUES}?completed=true`
    : API_ENDPOINTS.SAVESHIFTVALUES;
  return api.post(url, data);
};

export const setActiveAor = (aorId: string) =>
  api.patch(API_ENDPOINTS.SET_ACTIVE_AOR, { aorId });

export const endAOR = async (shiftId: string): Promise<EndShiftResponse> => {
  const res = await api.post(`${API_ENDPOINTS.END_AOR}/${shiftId}`);
  return res.data;
};
