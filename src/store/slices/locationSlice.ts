import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchStates,
  fetchCitiesByState,
  fetchTimezones,
} from "@/src/services/aorService";
import {
  StateResponse,
  CityResponse,
  TimezoneResponse,
} from "@/src/types/aor.types";
import { getErrorMessage } from "@/src/utils/config";

export interface LocationState {
  states: StateResponse[];
  cities: CityResponse[];
  timezones: TimezoneResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  states: [],
  cities: [],
  timezones: [],
  loading: false,
  error: null,
};

// ================= Thunks =================
export const getStates = createAsyncThunk<
  StateResponse[],
  void,
  { rejectValue: string }
>("location/getStates", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchStates();
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch states"));
  }
});

export const getCitiesByState = createAsyncThunk<
  CityResponse[],
  string,
  { rejectValue: string }
>("location/getCitiesByState", async (stateId, { rejectWithValue }) => {
  try {
    const response = await fetchCitiesByState(stateId);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch cities"));
  }
});

export const getTimezones = createAsyncThunk<
  TimezoneResponse[],
  void,
  { rejectValue: string }
>("location/getTimezones", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchTimezones();
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch timezones"));
  }
});

// ================= Slice =================
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocationState: (state) => {
      state.loading = false;
      state.error = null;
      state.states = [];
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getStates.fulfilled,
        (state, action: PayloadAction<StateResponse[]>) => {
          state.loading = false;
          state.states = action.payload;
        },
      )
      .addCase(getStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching states";
      })

      .addCase(getCitiesByState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCitiesByState.fulfilled,
        (state, action: PayloadAction<CityResponse[]>) => {
          state.loading = false;
          state.cities = action.payload;
        },
      )
      .addCase(getCitiesByState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching cities";
      })
      .addCase(getTimezones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTimezones.fulfilled,
        (state, action: PayloadAction<TimezoneResponse[]>) => {
          state.loading = false;
          state.timezones = action.payload;
        },
      )
      .addCase(getTimezones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching timezones";
      });
  },
});

export const { clearLocationState } = locationSlice.actions;
export default locationSlice.reducer;
