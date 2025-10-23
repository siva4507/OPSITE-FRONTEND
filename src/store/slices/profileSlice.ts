import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchProfile } from "@/src/services/profileService";
import { UserDto, ThemeDto } from "@/src/types/profile.types";
import { getErrorMessage } from "@/src/utils/config";
import {
  updateUserProfileUrl,
  updateUsername,
} from "@/src/store/slices/authSlice";

// State type
export interface ProfileState {
  user: UserDto | null;
  activeShift: number | null;
  theme: ThemeDto | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProfileState = {
  user: null,
  activeShift: null,
  theme: null,
  loading: false,
  error: null,
};

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchProfile();
      const data = response.data;

      if (data.user) {
        dispatch(updateUserProfileUrl(data.user.profileUrl || null));
        dispatch(updateUsername(data.user.username || ""));
      }
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch profile"));
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.user = null;
      state.activeShift = null;
      state.theme = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfile.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: UserDto;
            activeShift: number;
            theme: ThemeDto;
          }>,
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.activeShift = action.payload.activeShift;
          state.theme = action.payload.theme;
        },
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
