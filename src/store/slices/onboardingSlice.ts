import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRoles,
  getAreasOfResponsibility,
  getQualityOfSleep,
  getControllerUsers,
  assignShift,
  getCompanies,
  uploadSignature,
  logoutt,
  impersonateUser,
} from "@/src/services/onboardingServices";
import {
  Role,
  AreaOfResponsibility,
  ControllerUser,
  ShiftAssignmentData,
  Company,
  QualityOfSleep,
  UploadSignatureResponse,
  ImpersonateResponse,
} from "@/src/dto/onboarding.dto";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { getErrorMessage } from "@/src/utils/config";
import { setImpersonateToken } from "@/src/utils/authToken";

interface OnboardingState {
  roles: Role[];
  areasOfResponsibility: AreaOfResponsibility;
  qualityOfSleep: QualityOfSleep[];
  users: ControllerUser[];
  shiftAssignment: {
    aorId: string[];
    ratingId: string;
    continuousRestHours: number;
    loginTime: string;
  } | null;
  loading: boolean;
  error: string | null;
  companies: Company[];
  companiesFetched: boolean;
  signatureBase64?: string;
  selectedCompanies: string[];
  lastFetchedCompanies: string[];
  impersonateToken: string | null;
}

const initialState: OnboardingState = {
  roles: [],
  areasOfResponsibility: { aors: [], recentAor: [], activeAors: [] },
  qualityOfSleep: [],
  users: [],
  shiftAssignment: null,
  loading: false,
  error: null,
  companies: [],
  companiesFetched: false,
  signatureBase64: undefined,
  selectedCompanies: [],
  lastFetchedCompanies: [],
  impersonateToken: null,
};

const initializeShiftAssignment = (state: OnboardingState) => {
  if (!state.shiftAssignment) {
    const loginTime = localStorage.getItem("loginRequestTime") || "";

    state.shiftAssignment = {
      aorId: [],
      ratingId: "",
      continuousRestHours: 0,
      loginTime,
    };
  }
};

const onboardingPersistConfig = {
  key: "onboarding",
  storage,
  whitelist: ["shiftAssignment", "selectedCompanies", "lastFetchedCompanies"],
};

export const fetchRoles = createAsyncThunk(
  "onboarding/fetchRoles",
  async (_, thunkAPI) => {
    try {
      const response = await getRoles();
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch roles",
      );
    }
  },
);

export const fetchAreasOfResponsibility = createAsyncThunk(
  "onboarding/fetchAreasOfResponsibility",
  async (companyIds: string[], thunkAPI) => {
    try {
      const response = await getAreasOfResponsibility(companyIds);
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch areas of responsibility",
      );
    }
  },
);

export const fetchQualityOfSleep = createAsyncThunk(
  "onboarding/fetchQualityOfSleep",
  async (_, thunkAPI) => {
    try {
      const response = await getQualityOfSleep();
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch quality of sleep",
      );
    }
  },
);

export const logouts = createAsyncThunk("onboarding/logout", async () => {
  try {
    return await logoutt();
  } catch {
    return {};
  }
});

export const fetchControllerUsers = createAsyncThunk(
  "controller/fetchControllerUsers",
  async (_, thunkAPI) => {
    try {
      const response = await getControllerUsers();
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch controllers",
      );
    }
  },
);

export const uploadSignatureThunk = createAsyncThunk<
  UploadSignatureResponse,
  File,
  { rejectValue: string }
>("onboarding/uploadSignature", async (file, thunkAPI) => {
  try {
    return await uploadSignature(file);
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to upload signature",
    );
  }
});

type AssignShiftError = {
  message: string;
  statusCode?: number;
};

export const assignShiftAction = createAsyncThunk<
  ShiftAssignmentData,
  {
    aorId: string[];
    ratingId?: string;
    continuousRestHours?: number;
    loginTime?: string;
  },
  {
    rejectValue: AssignShiftError;
  }
>("onboarding/assignShift", async (data, thunkAPI) => {
  try {
    return await assignShift(data);
  } catch (err) {
    const error = err as { message?: string; statusCode?: number };
    return thunkAPI.rejectWithValue({
      message: error.message ?? "Failed to assign shift",
      statusCode: error.statusCode,
    });
  }
});

export const fetchCompanies = createAsyncThunk(
  "onboarding/fetchCompanies",
  async (_, thunkAPI) => {
    try {
      const response = await getCompanies();
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies",
      );
    }
  },
);

export const impersonateUserThunk = createAsyncThunk<
  ImpersonateResponse,
  string,
  { rejectValue: string }
>("onboarding/impersonateUser", async (userId, thunkAPI) => {
  try {
    const res = await impersonateUser(userId);
    if (res.token) {
      setImpersonateToken(res.token);
    }

    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to impersonate user"),
    );
  }
});

function clearOnboardingPersistedShiftAssignment() {
  localStorage.removeItem("persist:onboarding");
}

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setSelectedHours: (state, action) => {
      initializeShiftAssignment(state);
      state.shiftAssignment!.continuousRestHours = action.payload;
    },
    setSelectedRating: (state, action) => {
      initializeShiftAssignment(state);
      state.shiftAssignment!.ratingId = action.payload;
    },
    setSelectedAORs: (state, action) => {
      initializeShiftAssignment(state);
      state.shiftAssignment!.aorId = [...action.payload];
    },
    clearShiftAssignment: (state) => {
      state.shiftAssignment = null;
      state.signatureBase64 = undefined;
      clearOnboardingPersistedShiftAssignment();
    },
    setSelectedCompanies: (state, action) => {
      state.selectedCompanies = action.payload;
    },
    setLastFetchedCompanies: (state, action) => {
      state.lastFetchedCompanies = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOnboardingState: (state) => {
      state.roles = [];
      state.areasOfResponsibility = { aors: [], recentAor: [], activeAors: [] };
      state.qualityOfSleep = [];
      state.users = [];
      state.shiftAssignment = null;
      state.error = null;
      state.signatureBase64 = "";
      state.selectedCompanies = [];
      state.lastFetchedCompanies = [];
      clearOnboardingPersistedShiftAssignment();
    },
    setSignatureBase64: (state, action) => {
      state.signatureBase64 = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAreasOfResponsibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAreasOfResponsibility.fulfilled, (state, action) => {
        state.loading = false;
        state.areasOfResponsibility = action.payload;
      })
      .addCase(fetchAreasOfResponsibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQualityOfSleep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQualityOfSleep.fulfilled, (state, action) => {
        state.loading = false;
        state.qualityOfSleep = action.payload;
      })
      .addCase(fetchQualityOfSleep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchControllerUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchControllerUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchControllerUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignShiftAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignShiftAction.fulfilled, (state) => {
        state.loading = false;
        // state.shiftAssignment = action.payload;
      })
      .addCase(assignShiftAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
        } else {
          state.error = "Failed to assign shift";
        }
      })
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
        state.companiesFetched = true;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.companiesFetched = true;
      })
      .addCase(uploadSignatureThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadSignatureThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadSignatureThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(impersonateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(impersonateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.impersonateToken = action.payload.token;
      })
      .addCase(impersonateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to impersonate user";
      });
  },
});

export const persistedOnboardingReducer = persistReducer(
  onboardingPersistConfig,
  onboardingSlice.reducer,
);

export const {
  setSelectedHours,
  setSelectedRating,
  setSelectedAORs,
  clearShiftAssignment,
  clearError,
  resetOnboardingState,
  setSignatureBase64,
  setSelectedCompanies,
  setLastFetchedCompanies,
} = onboardingSlice.actions;
