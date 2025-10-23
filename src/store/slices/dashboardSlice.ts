import {
  fetchShiftTimeByAor,
  fetchWeatherByAor,
  fetchWorkStats,
} from "@/src/services/dashboardService";
import {
  ShiftTimeByAorItem,
  WeatherByAorItem,
  WorkStatsDataV2,
} from "@/src/types/dashboard.types";
import { getErrorMessage } from "@/src/utils/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getWeatherByAor = createAsyncThunk<
  { message: string; data: WeatherByAorItem[] },
  string | undefined,
  { rejectValue: string }
>("dashboard/getWeatherByAor", async (aorId, { rejectWithValue }) => {
  try {
    return await fetchWeatherByAor(aorId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch weather"));
  }
});

export const getShiftTimeByAor = createAsyncThunk<
  { message: string; data: ShiftTimeByAorItem },
  string | undefined,
  { rejectValue: string }
>("dashboard/getShiftTimeByAor", async (aorId, { rejectWithValue }) => {
  try {
    return await fetchShiftTimeByAor(aorId);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch shift time"));
  }
});


export const getWorkStats = createAsyncThunk<
  { message: string; data: WorkStatsDataV2 },
  void,
  { rejectValue: string }
>("dashboard/getWorkStats", async (_, { rejectWithValue }) => {
  try {
    return await fetchWorkStats();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch work stats"));
  }
});

interface DashboardState {
  weather: WeatherByAorItem[] | null;
  shiftTime: ShiftTimeByAorItem | null;
  workStats: WorkStatsDataV2 | null;
  loading: boolean;
  error: string | null;
  weatherLoading: boolean;
}

const initialState: DashboardState = {
  weather: [],
  shiftTime: null,
  workStats: null,
  loading: false,
  error: null,
  weatherLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
    clearDashboardData(state) {
      state.weather = null;
      state.shiftTime = null;
      state.workStats = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWeatherByAor.pending, (state) => {
      state.weatherLoading = true;
      state.error = null;
      state.weather = null;
    });
    builder.addCase(getWeatherByAor.fulfilled, (state, action) => {
      state.weatherLoading = false;
      state.weather = action.payload.data || null;
    });
    builder.addCase(getWeatherByAor.rejected, (state, action) => {
      state.weatherLoading = false;
      state.error = action.payload ?? "Failed to fetch weather";
      state.weather = null;
    });
    builder.addCase(getShiftTimeByAor.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getShiftTimeByAor.fulfilled, (state, action) => {
      state.loading = false;
      state.shiftTime = action.payload.data;
    });
    builder.addCase(getShiftTimeByAor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Failed to fetch shift time";
    });

    builder.addCase(getWorkStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getWorkStats.fulfilled, (state, action) => {
      state.loading = false;
      state.workStats = action.payload.data;
    });
    builder.addCase(getWorkStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Failed to fetch work stats";
    });
  },
});

export const { clearDashboardError, clearDashboardData } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
