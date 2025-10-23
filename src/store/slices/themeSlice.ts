import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSystemThemes,
  updateUserTheme,
  uploadBackgroundImage,
} from "@/src/services/themeService";
import { Theme } from "@/src/dto/theme.dto";
import { ThemeMode } from "@/src/types/types";
import { getErrorMessage } from "@/src/utils/config";

interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

interface ThemeState {
  themes: Theme[];
  loading: boolean;
  error: string | null;
  mode: ThemeMode;
}

const initialState: ThemeState = {
  themes: [],
  loading: false,
  error: null,
  mode: "light",
};

export const getSystemThemes = createAsyncThunk(
  "theme/getSystemThemes",
  async (_, thunkAPI) => {
    try {
      const res = await fetchSystemThemes();
      return res;
    } catch (err: unknown) {
      const error = err as ApiError;
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to get themes"),
      );
    }
  },
);

export const updateUserThemeThunk = createAsyncThunk(
  "theme/updateUserTheme",
  async (
    payload: {
      themeId?: string;
      bgImage?: string;
      colorCode: string;
      opacity: number;
    },
    thunkAPI,
  ) => {
    try {
      const response = await updateUserTheme(payload);
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to update themes"),
      );
    }
  },
);

export const uploadBackgroundImageThunk = createAsyncThunk(
  "theme/uploadBackgroundImage",
  async (
    {
      file,
      colorCode,
      opacity,
    }: { file: File; colorCode: string; opacity: number },
    thunkAPI,
  ) => {
    try {
      const response = await uploadBackgroundImage(file, colorCode, opacity);
      return response.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to upload Image"),
      );
    }
  },
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSystemThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSystemThemes.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = action.payload;
      })
      .addCase(getSystemThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setThemeMode } = themeSlice.actions;

export default themeSlice.reducer;
