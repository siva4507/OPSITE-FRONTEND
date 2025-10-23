import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchFatigueScores,
  addFatigueScore,
  editFatigueScore,
  deleteFatigueScore,
} from "@/src/services/fatigueScoreService";
import {
  FatigueScore,
  FatigueScoreState,
  AddFatigueScoreRequestDto,
  EditFatigueScoreRequestDto,
  FatigueScoreRequestParams,
} from "@/src/types/fatigueScore.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
const initialState: FatigueScoreState = {
  scores: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

// Fetch fatigue scores with search, sort, pagination
export const getFatigueScores = createAsyncThunk(
  "fatigue/getFatigueScores",
  async (params: FatigueScoreRequestParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetchFatigueScores(params);
      return response.data.data; // data.data from the API response
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch fatigue scores"),
      );
    }
  },
);

// Add new fatigue score
export const createFatigueScore = createAsyncThunk(
  "fatigue/createFatigueScore",
  async (payload: AddFatigueScoreRequestDto, { rejectWithValue }) => {
    try {
      const response = await addFatigueScore(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add fatigue score"),
      );
    }
  },
);

// Update existing fatigue score
export const updateFatigueScore = createAsyncThunk(
  "fatigue/updateFatigueScore",
  async (
    {
      scoreId,
      payload,
    }: { scoreId: string; payload: EditFatigueScoreRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editFatigueScore(scoreId, payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update fatigue score"),
      );
    }
  },
);

// Delete fatigue score
export const removeFatigueScore = createAsyncThunk(
  "fatigue/removeFatigueScore",
  async (scoreId: string, { rejectWithValue }) => {
    try {
      const response = await deleteFatigueScore(scoreId);
      return { scoreId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete fatigue score"),
      );
    }
  },
);

const fatigueSlice = createSlice({
  name: "fatigue",
  initialState,
  reducers: {
    resetFatigueScores: (state) => {
      state.scores = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get fatigue scores
      .addCase(getFatigueScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFatigueScores.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: FatigueScore[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.scores = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getFatigueScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create fatigue score
      .addCase(createFatigueScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createFatigueScore.fulfilled,
        (state, action: PayloadAction<FatigueScore>) => {
          state.loading = false;
          state.scores.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createFatigueScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update fatigue score
      .addCase(updateFatigueScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateFatigueScore.fulfilled,
        (state, action: PayloadAction<FatigueScore>) => {
          state.loading = false;
          const index = state.scores.findIndex(
            (s) => s._id === action.payload._id,
          );
          if (index !== -1) {
            state.scores[index] = action.payload;
          }
        },
      )
      .addCase(updateFatigueScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove fatigue score
      .addCase(removeFatigueScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFatigueScore.fulfilled,
        (
          state,
          action: PayloadAction<{ scoreId: string; message: string }>,
        ) => {
          state.loading = false;
          state.scores = state.scores.filter(
            (s) => s._id !== action.payload.scoreId,
          );
          state.total -= 1;
        },
      )
      .addCase(removeFatigueScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetFatigueScores } = fatigueSlice.actions;
export default fatigueSlice.reducer;
