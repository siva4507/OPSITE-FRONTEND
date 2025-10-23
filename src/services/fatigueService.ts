import {
  ActiveShiftMitigationsApiResponse,
  ActiveShiftMitigationsResponse,
  ApplyMitigationRequestDto,
  ApplyMitigationResponseDto,
  CurrentShiftFatigueScore,
  FetchFatigueMitigationResponseDto,
  RecentActivityResponse,
  RecentShiftsResponse,
  StartTimerRequestDto,
  StartTimerResponseDto,
  StopTimerResponse,
  TimerViewResponseDto,
} from "../types/fatigue.types";
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const fetchFatigueMitigations =
  async (): Promise<FetchFatigueMitigationResponseDto> => {
    const response = await api.get<FetchFatigueMitigationResponseDto>(
      API_ENDPOINTS.FATIGUE_MITIGATION,
    );
    return response.data;
  };

export const applyFatigueMitigation = async (
  payload: ApplyMitigationRequestDto,
): Promise<ApplyMitigationResponseDto> => {
  const response = await api.post<ApplyMitigationResponseDto>(
    API_ENDPOINTS.APPLY_MITIGATION,
    payload,
  );
  return response.data;
};

export const fetchActiveShiftMitigations =
  async (): Promise<ActiveShiftMitigationsResponse> => {
    try {
      const response = await api.get<ActiveShiftMitigationsApiResponse>(
        API_ENDPOINTS.ACTIVE_SHIFT_MITIGATIONS,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching active shift mitigations:", error);
      throw (
        error.response?.data ||
        error.message ||
        "Failed to fetch active shift mitigations"
      );
    }
  };

export const stopTimer = async (id: string): Promise<StopTimerResponse> => {
  try {
    const response = await api.patch<StopTimerResponse>(
      `${API_ENDPOINTS.STOP_TIMER}/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error stopping timer:", error);
    throw error.response?.data || error.message || "Failed to stop timer";
  }
};

export const fetchRecentShifts = async (): Promise<RecentShiftsResponse> => {
  try {
    const response = await api.get<RecentShiftsResponse>(
      API_ENDPOINTS.RECENT_SHIFTS,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching recent shifts:", error);
    throw (
      error.response?.data || error.message || "Failed to fetch recent shifts"
    );
  }
};

export const getCurrentShiftFatigueScore =
  async (): Promise<CurrentShiftFatigueScore> => {
    try {
      const response = await api.get<CurrentShiftFatigueScore>(
        API_ENDPOINTS.CURRENT_SHIFT_FATIGUE_SCORE,
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch current shift fatigue score", error);
      throw error;
    }
  };

export const startTimer = async (
  payload: StartTimerRequestDto,
): Promise<StartTimerResponseDto> => {
  try {
    const response = await api.post<StartTimerResponseDto>(
      API_ENDPOINTS.START_TIMER,
      payload,
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error starting timer:", error);
    throw error.response?.data || error.message || "Failed to start timer";
  }
};

export const fetchTimers = async (): Promise<TimerViewResponseDto> => {
  try {
    const response = await api.get<TimerViewResponseDto>(
      API_ENDPOINTS.TIMER_VIEW,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching timers:", error);
    throw error.response?.data || error.message || "Failed to fetch timers";
  }
};

export const pauseTimer = async (
  id: string,
): Promise<StartTimerResponseDto> => {
  try {
    const response = await api.post<StartTimerResponseDto>(
      `${API_ENDPOINTS.PAUSE_TIMER}/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error pausing timer:", error);
    throw error.response?.data || error.message || "Failed to pause timer";
  }
};

// Resume Timer
export const resumeTimer = async (
  id: string,
): Promise<StartTimerResponseDto> => {
  try {
    const response = await api.post<StartTimerResponseDto>(
      `${API_ENDPOINTS.RESUME_TIMER}/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error resuming timer:", error);
    throw error.response?.data || error.message || "Failed to resume timer";
  }
};

// Stop Timer (you already have stopTimer, but keeping for consistency)
export const stopTimerById = async (
  id: string,
): Promise<StartTimerResponseDto> => {
  try {
    const response = await api.post<StartTimerResponseDto>(
      `${API_ENDPOINTS.STOP_REMAINDER_TIMER}/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("Error stopping timer:", error);
    throw error.response?.data || error.message || "Failed to stop timer";
  }
};

export const fetchRecentActivity =
  async (): Promise<RecentActivityResponse> => {
    try {
      const response = await api.get<RecentActivityResponse>(
        API_ENDPOINTS.RECENT_ACTIVITY,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching recent activity:", error);
      throw (
        error.response?.data ||
        error.message ||
        "Failed to fetch recent activity"
      );
    }
  };
