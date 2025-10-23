import {
  ShiftTimeByAorItem,
  WeatherByAorItem,
  WorkStatsDataV2,
} from "../types/dashboard.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchWeatherByAor = async (
  aorId?: string,
): Promise<{
  message: string;
  data: WeatherByAorItem[];
}> => {
  const response = await api.get<{ message: string; data: WeatherByAorItem[] }>(
    API_ENDPOINTS.WEATHER_BY_AOR,
    { params: aorId ? { aorId } : undefined },
  );
  return response.data;
};

export const fetchShiftTimeByAor = async (
  aorId?: string,
): Promise<{ message: string; data: ShiftTimeByAorItem }> => {
  const url = aorId
    ? `${API_ENDPOINTS.REMAINING_SHIFT_TIME}?aorId=${aorId}`
    : `${API_ENDPOINTS.REMAINING_SHIFT_TIME}`;

  const response = await api.get<{ message: string; data: ShiftTimeByAorItem }>(
    url,
  );
  return response.data;
};



export const fetchWorkStats = async (): Promise<{
  message: string;
  data: WorkStatsDataV2;
}> => {
  const response = await api.get<{ message: string; data: WorkStatsDataV2 }>(
    API_ENDPOINTS.WORK_STATS,
  );
  return response.data;
};