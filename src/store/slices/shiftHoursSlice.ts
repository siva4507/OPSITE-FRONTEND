// src/store/shiftHoursSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchShiftHours,
  addShiftHours,
  editShiftHours,
  deleteShiftHours,
} from "@/src/services/shiftHoursService";
import {
  ShiftHoursState,
  ShiftHours,
  ShiftHoursRequestDto,
} from "@/src/types/shiftHours.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
const initialState: ShiftHoursState = {
  shiftHours: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

// Fetch shift hours
export const getShiftHours = createAsyncThunk(
  "shiftHours/getShiftHours",
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
      const response = await fetchShiftHours(params);
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch shift hours"),
      );
    }
  },
);

// Add shift hours
export const createShiftHours = createAsyncThunk(
  "shiftHours/createShiftHours",
  async (payload: ShiftHoursRequestDto, { rejectWithValue }) => {
    try {
      const response = await addShiftHours(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add shift hours"),
      );
    }
  },
);

// Update shift hours
export const updateShiftHours = createAsyncThunk(
  "shiftHours/updateShiftHours",
  async (
    {
      shiftHoursId,
      payload,
    }: { shiftHoursId: string; payload: ShiftHoursRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editShiftHours(shiftHoursId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update shift hours"),
      );
    }
  },
);

// Remove shift hours
export const removeShiftHours = createAsyncThunk(
  "shiftHours/removeShiftHours",
  async (shiftHoursId: string, { rejectWithValue }) => {
    try {
      const response = await deleteShiftHours(shiftHoursId);
      return { shiftHoursId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete shift hours"),
      );
    }
  },
);

const shiftHoursSlice = createSlice({
  name: "shiftHours",
  initialState,
  reducers: {
    resetShiftHours: (state) => {
      state.shiftHours = [];
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
      .addCase(getShiftHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getShiftHours.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: ShiftHours[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.shiftHours = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getShiftHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createShiftHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createShiftHours.fulfilled,
        (state, action: PayloadAction<ShiftHours>) => {
          state.loading = false;
          state.shiftHours.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createShiftHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updateShiftHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateShiftHours.fulfilled,
        (state, action: PayloadAction<ShiftHours>) => {
          state.loading = false;
          const index = state.shiftHours.findIndex(
            (item) => item._id === action.payload._id,
          );
          if (index !== -1) state.shiftHours[index] = action.payload;
        },
      )
      .addCase(updateShiftHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(removeShiftHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeShiftHours.fulfilled,
        (
          state,
          action: PayloadAction<{ shiftHoursId: string; message: string }>,
        ) => {
          state.loading = false;
          state.shiftHours = state.shiftHours.filter(
            (item) => item._id !== action.payload.shiftHoursId,
          );
          state.total -= 1;
        },
      )
      .addCase(removeShiftHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetShiftHours } = shiftHoursSlice.actions;
export default shiftHoursSlice.reducer;
