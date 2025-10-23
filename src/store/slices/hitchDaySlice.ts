// src/store/slices/hitchDaySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchHitchDays,
  addHitchDay,
  editHitchDay,
  deleteHitchDay,
} from "@/src/services/hitchDayService";
import { HitchDay, HitchDayRequestDto } from "@/src/types/hitchDay.types";
import { getErrorMessage } from "@/src/utils/config";

// State type
interface HitchDayState {
  hitchDays: HitchDay[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: HitchDayState = {
  hitchDays: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

// Fetch hitch days
export const getHitchDays = createAsyncThunk(
  "hitchDay/getHitchDays",
  async (
    params: {
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchHitchDays(params);
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch hitch days"),
      );
    }
  },
);

// Add hitch day
export const createHitchDay = createAsyncThunk(
  "hitchDay/createHitchDay",
  async (payload: HitchDayRequestDto, { rejectWithValue }) => {
    try {
      const response = await addHitchDay(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add hitch day"));
    }
  },
);

// Update hitch day
export const updateHitchDay = createAsyncThunk(
  "hitchDay/updateHitchDay",
  async (
    {
      hitchDayId,
      payload,
    }: { hitchDayId: string; payload: HitchDayRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editHitchDay(hitchDayId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update hitch day"),
      );
    }
  },
);

// Remove hitch day
export const removeHitchDay = createAsyncThunk(
  "hitchDay/removeHitchDay",
  async (hitchDayId: string, { rejectWithValue }) => {
    try {
      const response = await deleteHitchDay(hitchDayId);
      return { hitchDayId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete hitch day"),
      );
    }
  },
);

const hitchDaySlice = createSlice({
  name: "hitchDay",
  initialState,
  reducers: {
    resetHitchDays: (state) => {
      state.hitchDays = [];
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
      .addCase(getHitchDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getHitchDays.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: HitchDay[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.hitchDays = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )

      .addCase(getHitchDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createHitchDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createHitchDay.fulfilled,
        (state, action: PayloadAction<HitchDay>) => {
          state.loading = false;
          state.hitchDays.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createHitchDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updateHitchDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateHitchDay.fulfilled,
        (state, action: PayloadAction<HitchDay>) => {
          state.loading = false;
          const index = state.hitchDays.findIndex(
            (item) => item._id === action.payload._id,
          );
          if (index !== -1) state.hitchDays[index] = action.payload;
        },
      )
      .addCase(updateHitchDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(removeHitchDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeHitchDay.fulfilled,
        (
          state,
          action: PayloadAction<{ hitchDayId: string; message: string }>,
        ) => {
          state.loading = false;
          state.hitchDays = state.hitchDays.filter(
            (item) => item._id !== action.payload.hitchDayId,
          );
          state.total -= 1;
        },
      )
      .addCase(removeHitchDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetHitchDays } = hitchDaySlice.actions;
export default hitchDaySlice.reducer;
