import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  endAOR,
  getActiveShifts,
  getShiftFormTemplate,
  saveShiftValues,
  setActiveAor,
} from "@/src/services/shiftChangeServices";
import { ActiveShift, EndShiftResponse } from "@/src/dto/shiftChange.dto";
import { clearDashboardData } from "./dashboardSlice";

interface ShiftChangeState {
  activeShifts: ActiveShift[];
  loading: boolean;
  error: string | null;
  shiftLoading: boolean;
  formtemplates: { [key: string]: unknown };
  formtemplateLoading: { [key: string]: boolean };
  formtemplateError: { [key: string]: string | null };
  lastFocusedField: string | null;
  lastFocusedFieldInfo: {
    fieldName: string;
    isExtent: boolean;
    parentField?: string;
  } | null;
  selectedAorId: string | null;
  currentShiftAorId: string | null;

  endShiftStatus: "idle" | "loading" | "succeeded" | "failed";
  endShiftResult: EndShiftResponse | null;
  endShiftError: string | null;
  stoppedAor: boolean;
}

const initialState: ShiftChangeState = {
  activeShifts: [],
  loading: false,
  shiftLoading: false,
  error: null,
  formtemplates: {},
  formtemplateLoading: {},
  formtemplateError: {},
  lastFocusedField: null,
  lastFocusedFieldInfo: null,
  selectedAorId: null,
  currentShiftAorId:
    typeof window !== "undefined"
      ? localStorage.getItem("currentShiftAorId")
      : null,

  endShiftStatus: "idle",
  endShiftResult: null,
  endShiftError: null,
  stoppedAor: false,
};

export const fetchActiveShifts = createAsyncThunk(
  "shiftChange/fetchActiveShifts",
  async (_, thunkAPI) => {
    try {
      const res = await getActiveShifts();
      return res.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch active shifts",
      );
    }
  },
);

export const fetchShiftFormTemplate = createAsyncThunk(
  "shiftChange/fetchShiftFormTemplate",
  async ({ shiftAorId }: { shiftAorId: string }, thunkAPI) => {
    try {
      const res = await getShiftFormTemplate(shiftAorId);
      return { shiftAorId, template: res.data };
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue({
        shiftAorId,
        error:
          error.response?.data?.message ||
          "Failed to fetch shift form template",
      });
    }
  },
);

type Payload = unknown | { data: unknown; completed?: boolean };

export const saveShiftFormValues = createAsyncThunk(
  "shiftChange/saveShiftFormValues",
  async (payload: Payload, thunkAPI) => {
    try {
      let data: unknown;
      let completed: boolean | undefined;

      if (
        typeof payload === "object" &&
        payload !== null &&
        "data" in payload
      ) {
        data = (payload as { data: unknown }).data;
        completed = (payload as { completed?: boolean }).completed;
      } else {
        data = payload;
        completed = undefined;
      }

      const response = await saveShiftValues(data, completed);
      return response.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save shift form values",
      );
    }
  },
);

export const setActiveAorThunk = createAsyncThunk(
  "shiftChange/setActiveAor",
  async (aorId: string, thunkAPI) => {
    try {
      const res = await setActiveAor(aorId);
      return res.data;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set active AOR",
      );
    }
  },
);

export const endAorThunk = createAsyncThunk<
  EndShiftResponse,
  { aorId: string },
  { rejectValue: { aorId: string; error: string } }
>("shiftChange/endShift", async ({ aorId }, thunkAPI) => {
  try {
    const res = await endAOR(aorId);
    thunkAPI.dispatch(clearDashboardData());
    return res;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue({
      aorId,
      error: error.response?.data?.message || "Failed to end shift",
    });
  }
});

const shiftChangeSlice = createSlice({
  name: "shiftChange",
  initialState,
  reducers: {
    setLastFocusedField: (state, action) => {
      state.lastFocusedField = action.payload;
    },
    clearLastFocusedField: (state) => {
      state.lastFocusedField = null;
    },
    setLastFocusedFieldInfo: (state, action) => {
      state.lastFocusedFieldInfo = action.payload;
    },
    clearLastFocusedFieldInfo: (state) => {
      state.lastFocusedFieldInfo = null;
    },
    setStoppedAor: (state, action: PayloadAction<boolean>) => {
      state.stoppedAor = action.payload;
    },
    setCurrentShiftAorId: (state, action: PayloadAction<string>) => {
      state.currentShiftAorId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentShiftAorId", action.payload);
      }
    },

    resetShiftChange: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveShifts.pending, (state) => {
        state.loading = true;
        state.shiftLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftLoading = false;
        const sortedShifts = action.payload.map((shift) => ({
          ...shift,
          shiftAors: [...shift.shiftAors].sort((a, b) => {
            const aName = a.aor?.name ?? "";
            const bName = b.aor?.name ?? "";
            return aName.localeCompare(bName);
          }),
        }));

        state.activeShifts = sortedShifts;
        if (
          sortedShifts.length === 0 ||
          sortedShifts.every((shift) => shift.shiftAors.length === 0)
        ) {
          state.currentShiftAorId = null;
          if (typeof window !== "undefined") {
            localStorage.removeItem("currentShiftAorId");
          }
        } else if (
          !state.currentShiftAorId &&
          sortedShifts.length > 0 &&
          sortedShifts[0].shiftAors.length > 0
        ) {
          const defaultId = sortedShifts[0].shiftAors[0]._id;
          state.currentShiftAorId = defaultId;
          if (typeof window !== "undefined") {
            localStorage.setItem("currentShiftAorId", defaultId);
          }
        }
      })
      .addCase(fetchActiveShifts.rejected, (state, action) => {
        state.loading = false;
        state.shiftLoading = false;
        state.error = action.payload as string;
        const errorMessage = action.payload as string;
        if (errorMessage && errorMessage.includes("No Active Shift Found")) {
          state.activeShifts = [];
          state.currentShiftAorId = null;
          if (typeof window !== "undefined") {
            localStorage.removeItem("currentShiftAorId");
          }
        }
      })
      .addCase(fetchShiftFormTemplate.pending, (state, action) => {
        const { shiftAorId } = action.meta.arg;
        state.formtemplateLoading[shiftAorId] = true;
        state.formtemplateError[shiftAorId] = null;
      })
      .addCase(fetchShiftFormTemplate.fulfilled, (state, action) => {
        const { shiftAorId, template } = action.payload;
        state.formtemplateLoading[shiftAorId] = false;
        state.formtemplates[shiftAorId] = template;
      })
      .addCase(fetchShiftFormTemplate.rejected, (state, action) => {
        const payload = action.payload;
        if (payload && typeof payload === "object" && "shiftAorId" in payload) {
          const { shiftAorId, error } = payload as {
            shiftAorId: string;
            error?: string;
          };
          state.formtemplateLoading[shiftAorId] = false;
          state.formtemplateError[shiftAorId] =
            error || "Failed to fetch shift form template";
        }
      })
      .addCase(saveShiftFormValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveShiftFormValues.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveShiftFormValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setActiveAorThunk.fulfilled, (state, action) => {
        state.selectedAorId = action.meta.arg;
      })
      .addCase(endAorThunk.pending, (state) => {
        state.endShiftStatus = "loading";
        state.endShiftError = null;
      })
      .addCase(endAorThunk.fulfilled, (state, action) => {
        state.endShiftStatus = "succeeded";
        state.endShiftResult = action.payload;
      })
      .addCase(endAorThunk.rejected, (state, action) => {
        state.endShiftStatus = "failed";
        state.endShiftError = action.payload?.error || "Failed to end shift";
      });
  },
});

export const {
  setLastFocusedField,
  clearLastFocusedField,
  setLastFocusedFieldInfo,
  clearLastFocusedFieldInfo,
  resetShiftChange,
  setStoppedAor,
} = shiftChangeSlice.actions;
export default shiftChangeSlice.reducer;
