// src/store/slices/qosSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchQOS,
  addQOS,
  editQOS,
  deleteQOS,
} from "@/src/services/qosService";
import {
  QOS,
  QOSListResponseDto,
  AddQOSRequestDto,
} from "@/src/types/qos.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
export interface QOSState {
  qosList: QOS[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: QOSState = {
  qosList: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

// 🔹 Get QOS list
export const getQOS = createAsyncThunk(
  "qos/getQOS",
  async (
    params: {
      sortBy?: string;
      sortOrder?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response: QOSListResponseDto = await fetchQOS(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch QOS"));
    }
  },
);

// 🔹 Add QOS
export const createQOS = createAsyncThunk(
  "qos/createQOS",
  async (payload: AddQOSRequestDto, { rejectWithValue }) => {
    try {
      const response = await addQOS(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add QOS"));
    }
  },
);

// 🔹 Update QOS
export const updateQOS = createAsyncThunk(
  "qos/updateQOS",
  async (
    { qosId, payload }: { qosId: string; payload: AddQOSRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editQOS(qosId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update QOS"));
    }
  },
);

// 🔹 Delete QOS
export const removeQOS = createAsyncThunk(
  "qos/removeQOS",
  async (qosId: string, { rejectWithValue }) => {
    try {
      const response = await deleteQOS(qosId);
      return { qosId, message: response.message };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete QOS"));
    }
  },
);

const qosSlice = createSlice({
  name: "qos",
  initialState,
  reducers: {
    resetQOS: (state) => {
      state.qosList = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQOS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getQOS.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: QOS[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.qosList = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getQOS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createQOS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQOS.fulfilled, (state, action: PayloadAction<QOS>) => {
        state.loading = false;
        state.qosList.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createQOS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateQOS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQOS.fulfilled, (state, action: PayloadAction<QOS>) => {
        state.loading = false;
        const index = state.qosList.findIndex(
          (q) => q._id === action.payload._id,
        );
        if (index !== -1) {
          state.qosList[index] = action.payload;
        }
      })
      .addCase(updateQOS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeQOS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeQOS.fulfilled,
        (state, action: PayloadAction<{ qosId: string; message: string }>) => {
          state.loading = false;
          state.qosList = state.qosList.filter(
            (q) => q._id !== action.payload.qosId,
          );
          state.total = state.total - 1;
        },
      )
      .addCase(removeQOS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetQOS } = qosSlice.actions;
export default qosSlice.reducer;
