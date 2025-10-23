import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "@/src/services/authServices";
import { logoutt } from "@/src/services/onboardingServices";
import { AuthState, Role } from "@/src/types/auth.types";
import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
} from "@/src/dto/auth.dto";
import { clearImpersonateToken, storeToken } from "@/src/utils/authToken";
import { updateUserThemeThunk } from "./themeSlice";
import { updateUserThemeFromResponse } from "@/src/utils/themeUtils";
import { RootState } from "@/src/store/store";
import { resetOnboardingState } from "./onboardingSlice";
import { clearDashboardData } from "./dashboardSlice";
import { resetShiftChange } from "./shiftChangeSlice";

function clearOnboardingPersistedData() {
  localStorage.removeItem("persist:onboarding");
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  roles: [],
  step: "login",
  isOnboardingCompleted: false,
  hasUploadedSignature: false,
  rememberMe: false,
  selectedRole: null,
  onRefetch: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, thunkAPI) => {
    try {
      const response = await loginUser(data);

      const rememberMe = data.rememberMe || false;
      storeToken(response.data.token, rememberMe);

      const requestTime = new Date().toISOString();
      localStorage.setItem("loginRequestTime", requestTime);

      return {
        ...response.data,
        activeShiftCount: response.data.activeShift,
      };
    } catch (err: unknown) {
      let message = "Invalid Credential";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })
          .response === "object"
      ) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        message = response?.data?.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, thunkAPI) => {
    try {
      return await registerUser(data);
    } catch (err: unknown) {
      let message = "Registration failed";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })
          .response === "object"
      ) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        message = response?.data?.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const forgot = createAsyncThunk(
  "auth/forgot",
  async (data: ForgotPasswordData, thunkAPI) => {
    try {
      return await forgotPassword(data);
    } catch (err: unknown) {
      let message = "Request failed";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })
          .response === "object"
      ) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        message = response?.data?.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const resetPasswordAction = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    thunkAPI,
  ) => {
    try {
      return await resetPassword({ token, newPassword });
    } catch (err: unknown) {
      let message = "Reset password failed";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })
          .response === "object"
      ) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        message = response?.data?.message || message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutt();

    thunkAPI.dispatch(resetOnboardingState());
    thunkAPI.dispatch(clearDashboardData());
    thunkAPI.dispatch(resetShiftChange());
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:onboarding");
      clearImpersonateToken();
      clearDashboardData();
      const itemsToRemove = [
        "auth_token",
        "rememberMe",
        "userSignatureBase64",
        "selectedRole",
        "loginRequestTime",
        "isOnboardingCompleted",
        "documentViewMode",
        "currentShiftAorId",
        "impersonateToken",
        "activeControllerName",
      ];
      itemsToRemove.forEach((item) => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });

      document.cookie =
        "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    return true;
  } catch {
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:onboarding");
      clearImpersonateToken();
      clearDashboardData();
      const itemsToRemove = [
        "auth_token",
        "rememberMe",
        "userSignatureBase64",
        "selectedRole",
        "loginRequestTime",
        "isOnboardingCompleted",
        "documentViewMode",
        "currentShiftAorId",
        "impersonateToken",
        "activeControllerName",
      ];
      itemsToRemove.forEach((item) => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
      });

      document.cookie =
        "selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    return true;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setOnboardingCompleted(state, action) {
      state.isOnboardingCompleted = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("isOnboardingCompleted", "true");
        } else {
          localStorage.setItem("isOnboardingCompleted", "false");
        }
      }
    },
    setRememberMe(state, action) {
      state.rememberMe = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("rememberMe", action.payload.toString());
      }
    },
    clearError(state) {
      state.error = null;
    },
    setSelectedRoles: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedRole", action.payload);
        document.cookie = `selectedRole=${action.payload}; path=/`;
      }
    },
    clearOnboardingData() {
      clearOnboardingPersistedData();
    },
    reset: () => initialState,
    setUploadSignature: (state, action: PayloadAction<boolean>) => {
      state.hasUploadedSignature = action.payload;
    },
    setRefetch: (state, action) => {
      state.onRefetch = action.payload;
    },
    updateUserProfileUrl: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.profileUrl = action.payload;
      }
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.username = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          ...action.payload.user,
          activeShiftCount: action.payload.activeShiftCount,
        };
        state.roles = action.payload.user.roles.map((r: Role) => r.name);
        const loginData = action.meta.arg as LoginData;
        state.rememberMe = loginData.rememberMe || false;
        state.isOnboardingCompleted = false;
        state.hasUploadedSignature = !!action.payload.user.signatureUrl;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(forgot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgot.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(resetPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserThemeThunk.fulfilled, (state, action) => {
        if (state.user) {
          const themeState = (state as unknown as RootState).theme;
          const themes = themeState?.themes || [];
          const updatedTheme = updateUserThemeFromResponse(
            state.user,
            themes,
            action.payload,
          );
          if (updatedTheme) {
            state.user.theme = updatedTheme;
          }
        }
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isOnboardingCompleted = false;
        state.isAuthenticated = false;
        state.rememberMe = false;
        state.selectedRole = null;
        state.roles = [];
        state.step = "login";
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isOnboardingCompleted = false;
        state.isAuthenticated = false;
        state.rememberMe = false;
        state.selectedRole = null;
        state.roles = [];
        state.step = "login";
        state.error = null;
      });
  },
});

export const {
  setStep,
  setUser,
  setOnboardingCompleted,
  setRememberMe,
  clearError,
  clearOnboardingData,
  reset,
  setSelectedRoles,
  setUploadSignature,
  setRefetch,
  updateUserProfileUrl,
  updateUsername,
} = authSlice.actions;
export default authSlice.reducer;
