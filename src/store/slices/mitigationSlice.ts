import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMitigations,
  addMitigation,
  editMitigation,
  deleteMitigation,
} from "@/src/services/mitigationService";
import {
  MitigationState,
  Mitigation,
  MitigationRequestDto,
} from "@/src/types/mitigation.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
const initialState: MitigationState = {
  mitigations: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const getMitigations = createAsyncThunk(
  "mitigations/getMitigations",
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
      const response = await fetchMitigations(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch mitigations"),
      );
    }
  },
);

export const createMitigation = createAsyncThunk(
  "mitigations/createMitigation",
  async (payload: MitigationRequestDto, { rejectWithValue }) => {
    try {
      const response = await addMitigation(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add mitigation"),
      );
    }
  },
);

export const updateMitigation = createAsyncThunk(
  "mitigations/updateMitigation",
  async (
    {
      mitigationId,
      payload,
    }: { mitigationId: string; payload: MitigationRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editMitigation(mitigationId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update mitigation"),
      );
    }
  },
);

export const removeMitigation = createAsyncThunk(
  "mitigations/removeMitigation",
  async (mitigationId: string, { rejectWithValue }) => {
    try {
      const response = await deleteMitigation(mitigationId);
      return { mitigationId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete mitigation"),
      );
    }
  },
);

const mitigationSlice = createSlice({
  name: "mitigations",
  initialState,
  reducers: {
    resetMitigations: (state) => {
      state.mitigations = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMitigations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMitigations.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Mitigation[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.mitigations = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getMitigations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMitigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMitigation.fulfilled,
        (state, action: PayloadAction<Mitigation>) => {
          state.loading = false;
          state.mitigations.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createMitigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMitigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMitigation.fulfilled,
        (state, action: PayloadAction<Mitigation>) => {
          state.loading = false;
          const index = state.mitigations.findIndex(
            (mitigation) => mitigation._id === action.payload._id,
          );
          if (index !== -1) {
            state.mitigations[index] = action.payload;
          }
        },
      )
      .addCase(updateMitigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeMitigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeMitigation.fulfilled,
        (
          state,
          action: PayloadAction<{ mitigationId: string; message: string }>,
        ) => {
          state.loading = false;
          state.mitigations = state.mitigations.filter(
            (mitigation) => mitigation._id !== action.payload.mitigationId,
          );
          state.total = state.total - 1;
        },
      )
      .addCase(removeMitigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetMitigations } = mitigationSlice.actions;
export default mitigationSlice.reducer;
