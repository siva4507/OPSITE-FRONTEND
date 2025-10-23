// src/store/slices/aorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addAor,
  deleteAor,
  fetchAor,
  updateAor,
} from "@/src/services/aorService";
import {
  AddAorRequest,
  AddAorResponse,
  AorResponse,
  Aor,
} from "@/src/types/aor.types";
import { getErrorMessage } from "@/src/utils/config";

// ================= State Types =================
export interface AorState {
  items: Aor[]; // list of AORs
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  successMessage: string | null; // success message after add
  aorData: Aor | null; // newly added AOR
}

// ================= Initial State =================
const initialState: AorState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
  successMessage: null,
  aorData: null,
};

// ================= Thunks =================
export const getAors = createAsyncThunk<
  AorResponse,
  | {
      sortBy?: string;
      sortOrder?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  | undefined,
  { rejectValue: string }
>("aor/getAors", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchAor(params);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch AORs"));
  }
});

export const addAorThunk = createAsyncThunk<
  AddAorResponse,
  AddAorRequest,
  { rejectValue: string }
>("aor/addAor", async (payload, { rejectWithValue }) => {
  try {
    const response = await addAor(payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Failed to add AOR"));
  }
});

export const updateAorThunk = createAsyncThunk<
  AddAorResponse,
  { id: string; data: AddAorRequest },
  { rejectValue: string }
>("aor/updateAor", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateAor(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update AOR"));
  }
});

export const deleteAorThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("aor/deleteAor", async (id, { rejectWithValue }) => {
  try {
    await deleteAor(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete AOR"));
  }
});

// ================= Slice =================
const aorSlice = createSlice({
  name: "aor",
  initialState,
  reducers: {
    clearAorState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.aorData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get AORs
      .addCase(getAors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAors.fulfilled,
        (state, action: PayloadAction<AorResponse>) => {
          state.loading = false;
          state.items = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getAors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Add AOR
      .addCase(addAorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        addAorThunk.fulfilled,
        (state, action: PayloadAction<AddAorResponse>) => {
          state.loading = false;
          state.successMessage = action.payload.message;
          state.aorData = action.payload.data;
          state.items.push(action.payload.data); // ✅ push into items
        },
      )
      .addCase(addAorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(updateAorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        updateAorThunk.fulfilled,
        (state, action: PayloadAction<AddAorResponse>) => {
          state.loading = false;
          state.successMessage = action.payload.message;

          // replace updated AOR in list
          const updated = action.payload.data;
          const idx = state.items.findIndex((a) => a._id === updated._id);
          if (idx !== -1) {
            state.items[idx] = updated;
          }
        },
      )
      .addCase(updateAorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteAorThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAorThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter((aor) => aor._id !== action.payload);
        },
      )
      .addCase(deleteAorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error deleting AOR";
      });
  },
});

export const { clearAorState } = aorSlice.actions;
export default aorSlice.reducer;
