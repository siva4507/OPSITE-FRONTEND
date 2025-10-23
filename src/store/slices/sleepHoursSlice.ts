import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSleepHours,
  addSleepHours,
  editSleepHours,
  deleteSleepHours,
} from "@/src/services/sleepHoursService";
import {
  SleepHoursState,
  SleepHours,
  SleepHoursRequestDto,
} from "@/src/types/sleepHours.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
const initialState: SleepHoursState = {
  sleepHours: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

// Fetch sleep hours
export const getSleepHours = createAsyncThunk(
  "sleepHours/getSleepHours",
  async (
    params: {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchSleepHours(params);
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch sleep hours"),
      );
    }
  },
);

// Add sleep hours
export const createSleepHours = createAsyncThunk(
  "sleepHours/createSleepHours",
  async (payload: SleepHoursRequestDto, { rejectWithValue }) => {
    try {
      const response = await addSleepHours(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add sleep hours"),
      );
    }
  },
);

// Update sleep hours
export const updateSleepHours = createAsyncThunk(
  "sleepHours/updateSleepHours",
  async (
    {
      sleepHoursId,
      payload,
    }: { sleepHoursId: string; payload: SleepHoursRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editSleepHours(sleepHoursId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update sleep hours"),
      );
    }
  },
);

// Remove sleep hours
export const removeSleepHours = createAsyncThunk(
  "sleepHours/removeSleepHours",
  async (sleepHoursId: string, { rejectWithValue }) => {
    try {
      const response = await deleteSleepHours(sleepHoursId);
      return { sleepHoursId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete sleep hours"),
      );
    }
  },
);

const sleepHoursSlice = createSlice({
  name: "sleepHours",
  initialState,
  reducers: {
    resetSleepHours: (state) => {
      state.sleepHours = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getSleepHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSleepHours.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: SleepHours[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.sleepHours = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )

      .addCase(getSleepHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createSleepHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSleepHours.fulfilled,
        (state, action: PayloadAction<SleepHours>) => {
          state.loading = false;
          state.sleepHours.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createSleepHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updateSleepHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSleepHours.fulfilled,
        (state, action: PayloadAction<SleepHours>) => {
          state.loading = false;
          const index = state.sleepHours.findIndex(
            (item) => item._id === action.payload._id,
          );
          if (index !== -1) state.sleepHours[index] = action.payload;
        },
      )
      .addCase(updateSleepHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(removeSleepHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeSleepHours.fulfilled,
        (
          state,
          action: PayloadAction<{ sleepHoursId: string; message: string }>,
        ) => {
          state.loading = false;
          state.sleepHours = state.sleepHours.filter(
            (item) => item._id !== action.payload.sleepHoursId,
          );
          state.total -= 1;
        },
      )
      .addCase(removeSleepHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSleepHours } = sleepHoursSlice.actions;
export default sleepHoursSlice.reducer;
