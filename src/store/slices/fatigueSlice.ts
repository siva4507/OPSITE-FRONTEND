import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchFatigueMitigations,
  applyFatigueMitigation,
  fetchActiveShiftMitigations,
  stopTimer,
  fetchRecentShifts,
  getCurrentShiftFatigueScore,
  startTimer,
  fetchTimers,
  pauseTimer,
  resumeTimer,
  stopTimerById,
  fetchRecentActivity,
} from "@/src/services/fatigueService";
import { getErrorMessage } from "@/src/utils/config";
import {
  ActiveShiftMitigationsResponse,
  ApplyMitigationRequestDto,
  ApplyMitigationResponseDto,
  CurrentShiftFatigueScore,
  FatigueMitigationDto,
  RecentActivityItem,
  Shift,
  StartTimerRequestDto,
  StartTimerResponseDto,
  TimerData,
  TimerDataa,
} from "@/src/types/fatigue.types";

// State type
export interface FatigueMitigationState {
  mitigations: FatigueMitigationDto[];
  loading: boolean;
  error: string | null;
  applyLoading: boolean;
  applyResponse: ApplyMitigationResponseDto | null;
  activeShiftMitigations: ActiveShiftMitigationsResponse | null;
  activeLoading: boolean;
  activeError: string | null;
  stopLoading: boolean;
  stopError: string | null;
  recentShifts: Shift[] | null;
  recentLoading: boolean;
  recentError: string | null;
  currentShiftScore: CurrentShiftFatigueScore | null;
  currentShiftScoreLoading: boolean;
  currentShiftScoreError: string | null;
  startTimerLoading: boolean;
  startTimerError: string | null;
  startedTimerData: StartTimerResponseDto | null;
  timers: TimerDataa[] | null;
  timersLoading: boolean;
  timersError: string | null;
  pauseLoading: boolean;
  pauseError: string | null;
  resumeLoading: boolean;
  resumeError: string | null;
  stopTimerByIdLoading: boolean;
  stopTimerByIdError: string | null;
  recentActivity: RecentActivityItem[] | null;
  recentActivityLoading: boolean;
  recentActivityError: string | null;
}

// Initial state
const initialState: FatigueMitigationState = {
  mitigations: [],
  loading: false,
  error: null,
  applyLoading: false,
  applyResponse: null,
  activeShiftMitigations: null,
  activeLoading: false,
  activeError: null,
  stopLoading: false,
  stopError: null,
  recentShifts: null,
  recentLoading: false,
  recentError: null,
  currentShiftScore: null,
  currentShiftScoreLoading: false,
  currentShiftScoreError: null,
  startTimerLoading: false,
  startTimerError: null,
  startedTimerData: null,
  timers: null,
  timersLoading: false,
  timersError: null,
  pauseLoading: false,
  pauseError: null,
  resumeLoading: false,
  resumeError: null,
  stopTimerByIdLoading: false,
  stopTimerByIdError: null,
  recentActivity: null,
  recentActivityLoading: false,
  recentActivityError: null,
};

export const getFatigueMitigations = createAsyncThunk(
  "fatigueMitigation/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchFatigueMitigations();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch fatigue mitigations"),
      );
    }
  },
);

export const applyFatigueMitigationAction = createAsyncThunk(
  "fatigueMitigation/apply",
  async (payload: ApplyMitigationRequestDto, { rejectWithValue }) => {
    try {
      const response = await applyFatigueMitigation(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to apply fatigue mitigation"),
      );
    }
  },
);

export const getActiveShiftMitigations = createAsyncThunk(
  "fatigueMitigation/getActiveShiftMitigations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchActiveShiftMitigations();
      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch active shift mitigations"),
      );
    }
  },
);

export const stopTimerAction = createAsyncThunk(
  "fatigueMitigation/stopTimer",
  async (mitigationId: string, { rejectWithValue }) => {
    try {
      const response = await stopTimer(mitigationId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to stop timer"));
    }
  },
);

export const getRecentShifts = createAsyncThunk(
  "fatigueMitigation/getRecentShifts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchRecentShifts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch recent shifts"),
      );
    }
  },
);

export const fetchCurrentShiftScore = createAsyncThunk(
  "fatigueMitigation/fetchCurrentShiftScore",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentShiftFatigueScore();
      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch current shift fatigue score"),
      );
    }
  },
);

export const startTimerAction = createAsyncThunk<
  StartTimerResponseDto,
  StartTimerRequestDto,
  { rejectValue: string }
>("fatigueMitigation/startTimer", async (payload, { rejectWithValue }) => {
  try {
    const response = await startTimer(payload);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to start timer",
    );
  }
});

export const fetchTimersAction = createAsyncThunk<
  TimerDataa[],
  void,
  { rejectValue: string }
>("fatigueMitigation/fetchTimers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchTimers();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch timers",
    );
  }
});

export const pauseTimerAction = createAsyncThunk(
  "fatigueMitigation/pauseTimer",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await pauseTimer(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to pause timer"));
    }
  },
);

export const resumeTimerAction = createAsyncThunk(
  "fatigueMitigation/resumeTimer",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeTimer(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to resume timer"));
    }
  },
);

export const stopTimerByIdAction = createAsyncThunk(
  "fatigueMitigation/stopTimerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await stopTimerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to stop timer"));
    }
  },
);

export const fetchRecentActivityAction = createAsyncThunk<
  RecentActivityItem[],
  void,
  { rejectValue: string }
>("fatigueMitigation/fetchRecentActivity", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchRecentActivity();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch recent activity",
    );
  }
});

const fatigueMitigationSlice = createSlice({
  name: "fatigueMitigation",
  initialState,
  reducers: {
    resetFatigueMitigations: (state) => {
      state.mitigations = [];
      state.loading = false;
      state.error = null;
      state.applyResponse = null;
      state.applyLoading = false;
      state.activeShiftMitigations = null;
      state.activeLoading = false;
      state.activeError = null;
      state.recentShifts = null;
      state.recentLoading = false;
      state.recentError = null;
      state.currentShiftScore = null;
      state.currentShiftScoreLoading = false;
      state.currentShiftScoreError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mitigations
      .addCase(getFatigueMitigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFatigueMitigations.fulfilled,
        (state, action: PayloadAction<FatigueMitigationDto[]>) => {
          state.loading = false;
          state.mitigations = action.payload;
        },
      )
      .addCase(getFatigueMitigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Apply Mitigations
      .addCase(applyFatigueMitigationAction.pending, (state) => {
        state.applyLoading = true;
        state.error = null;
      })
      .addCase(
        applyFatigueMitigationAction.fulfilled,
        (state, action: PayloadAction<ApplyMitigationResponseDto>) => {
          state.applyLoading = false;
          state.applyResponse = action.payload;
        },
      )
      .addCase(applyFatigueMitigationAction.rejected, (state, action) => {
        state.applyLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getActiveShiftMitigations.pending, (state) => {
        state.activeLoading = true;
        state.activeError = null;
      })
      .addCase(
        getActiveShiftMitigations.fulfilled,
        (state, action: PayloadAction<ActiveShiftMitigationsResponse>) => {
          state.activeLoading = false;
          state.activeShiftMitigations = action.payload;
        },
      )
      .addCase(getActiveShiftMitigations.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = action.payload as string;
      })
      .addCase(stopTimerAction.pending, (state) => {
        state.stopLoading = true;
        state.stopError = null;
      })
      .addCase(stopTimerAction.fulfilled, (state) => {
        state.stopLoading = false;
        // Optionally update activeShiftMitigations here
      })
      .addCase(stopTimerAction.rejected, (state, action) => {
        state.stopLoading = false;
        state.stopError = action.payload as string;
      })
      .addCase(getRecentShifts.pending, (state) => {
        state.recentLoading = true;
        state.recentError = null;
      })
      .addCase(
        getRecentShifts.fulfilled,
        (state, action: PayloadAction<Shift[]>) => {
          state.recentLoading = false;
          state.recentShifts = action.payload;
        },
      )
      .addCase(getRecentShifts.rejected, (state, action) => {
        state.recentLoading = false;
        state.recentError = action.payload as string;
      })
      .addCase(fetchCurrentShiftScore.pending, (state) => {
        state.currentShiftScoreLoading = true;
        state.currentShiftScoreError = null;
      })
      .addCase(
        fetchCurrentShiftScore.fulfilled,
        (state, action: PayloadAction<CurrentShiftFatigueScore>) => {
          state.currentShiftScoreLoading = false;
          state.currentShiftScore = action.payload;
        },
      )
      .addCase(fetchCurrentShiftScore.rejected, (state, action) => {
        state.currentShiftScoreLoading = false;
        state.currentShiftScoreError = action.payload as string;
      })
      .addCase(startTimerAction.pending, (state) => {
        state.startTimerLoading = true;
        state.startTimerError = null;
      })
      .addCase(
        startTimerAction.fulfilled,
        (state, action: PayloadAction<StartTimerResponseDto>) => {
          state.startTimerLoading = false;
          state.startedTimerData = action.payload;
        },
      )
      .addCase(startTimerAction.rejected, (state, action) => {
        state.startTimerLoading = false;
        state.startTimerError = action.payload as string;
      })
      .addCase(fetchTimersAction.pending, (state) => {
        state.timersLoading = true;
        state.timersError = null;
      })
      .addCase(
        fetchTimersAction.fulfilled,
        (state, action: PayloadAction<TimerDataa[]>) => {
          state.timersLoading = false;
          state.timers = action.payload;
        },
      )
      .addCase(fetchTimersAction.rejected, (state, action) => {
        state.timersLoading = false;
        state.timersError = action.payload as string;
        state.timers = [];
      })
      .addCase(pauseTimerAction.pending, (state) => {
        state.pauseLoading = true;
        state.pauseError = null;
      })
      .addCase(
        pauseTimerAction.fulfilled,
        (state, action: PayloadAction<TimerData>) => {
          state.pauseLoading = false;
          if (state.timers) {
            const index = state.timers.findIndex(
              (t) => t._id === action.payload._id,
            );
            if (index !== -1) {
              // Merge the TimerData payload into existing TimerDataa
              state.timers[index] = {
                ...state.timers[index], // keep existing canControl
                ...action.payload,
              };
            }
          }
        },
      )

      .addCase(pauseTimerAction.rejected, (state, action) => {
        state.pauseLoading = false;
        state.pauseError = action.payload as string;
      })

      // RESUME TIMER
      .addCase(resumeTimerAction.pending, (state) => {
        state.resumeLoading = true;
        state.resumeError = null;
      })
      .addCase(
        resumeTimerAction.fulfilled,
        (state, action: PayloadAction<TimerData>) => {
          state.resumeLoading = false;
          if (state.timers) {
            const index = state.timers.findIndex(
              (t) => t._id === action.payload._id,
            );
            if (index !== -1) {
              state.timers[index] = {
                ...state.timers[index],
                ...action.payload,
              };
            }
          }
        },
      )
      .addCase(resumeTimerAction.rejected, (state, action) => {
        state.resumeLoading = false;
        state.resumeError = action.payload as string;
      })

      // STOP TIMER BY ID
      .addCase(stopTimerByIdAction.pending, (state) => {
        state.stopTimerByIdLoading = true;
        state.stopTimerByIdError = null;
      })
      .addCase(
        stopTimerByIdAction.fulfilled,
        (state, action: PayloadAction<TimerData>) => {
          state.stopTimerByIdLoading = false;
          if (state.timers) {
            const index = state.timers.findIndex(
              (t) => t._id === action.payload._id,
            );
            if (index !== -1) {
              state.timers[index] = {
                ...state.timers[index],
                ...action.payload,
              };
            }
          }
        },
      )
      .addCase(stopTimerByIdAction.rejected, (state, action) => {
        state.stopTimerByIdLoading = false;
        state.stopTimerByIdError = action.payload as string;
      })
      // FETCH RECENT ACTIVITY
      .addCase(fetchRecentActivityAction.pending, (state) => {
        state.recentActivityLoading = true;
        state.recentActivityError = null;
      })
      .addCase(
        fetchRecentActivityAction.fulfilled,
        (state, action: PayloadAction<RecentActivityItem[]>) => {
          state.recentActivityLoading = false;
          state.recentActivity = action.payload;
        },
      )
      .addCase(fetchRecentActivityAction.rejected, (state, action) => {
        state.recentActivityLoading = false;
        state.recentActivityError = action.payload as string;
      });
  },
});

export const { resetFatigueMitigations } = fatigueMitigationSlice.actions;
export default fatigueMitigationSlice.reducer;
