import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addTheme,
  deleteTheme,
  editTheme,
  fetchThemes,
} from "@/src/services/themeService";
import { Theme, FetchThemesResponse } from "@/src/types/theme.types";
import { getErrorMessage } from "@/src/utils/config";

interface ThemeState {
  themes: Theme[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error?: string | null;
}

const initialState: ThemeState = {
  themes: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
};

export const fetchThemesThunk = createAsyncThunk<
  FetchThemesResponse["data"],
  {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  },
  { rejectValue: string }
>("themes/fetchThemes", async (params, thunkAPI) => {
  try {
    const response = await fetchThemes(params);
    return response.data.data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch themes"),
    );
  }
});

export const addThemeThunk = createAsyncThunk(
  "themes/add",
  async (payload: FormData, thunkAPI) => {
    try {
      const theme = await addTheme(payload as any); // FormData passed
      return theme;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to add theme"),
      );
    }
  },
);

export const editThemeThunk = createAsyncThunk(
  "themes/edit",
  async (
    { themeId, payload }: { themeId: string; payload: FormData },
    thunkAPI,
  ) => {
    try {
      const theme = await editTheme(themeId, payload);
      return theme;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to update theme"),
      );
    }
  },
);

export const deleteThemeThunk = createAsyncThunk(
  "themes/delete",
  async (themeId: string, thunkAPI) => {
    try {
      const result = await deleteTheme(themeId);
      return { themeId, message: result.message };
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete theme"),
      );
    }
  },
);

const themeSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemesThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchThemesThunk.fulfilled,
        (state, action: PayloadAction<FetchThemesResponse["data"]>) => {
          state.loading = false;
          state.themes = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchThemesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addThemeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addThemeThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.themes.push(action.payload);
      })
      .addCase(addThemeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editThemeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editThemeThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          const index = state.themes.findIndex(
            (t) => t._id === action.payload._id,
          );
          if (index !== -1) state.themes[index] = action.payload;
        },
      )
      .addCase(editThemeThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteThemeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteThemeThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ themeId: string; message: string }>,
        ) => {
          state.loading = false;
          state.themes = state.themes.filter(
            (t) => t._id !== action.payload.themeId,
          );
        },
      )
      .addCase(
        deleteThemeThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export default themeSlice.reducer;
