import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchFacilities,
  addFacility,
  importFacility,
  getFacilitiesByAorId,
  updateFacility,
  deleteFacility,
} from "@/src/services/facilityService";
import { getErrorMessage } from "@/src/utils/config";
import {
  AddFacilityRequestDto,
  AddFacilityResponseDto,
  Facility,
  FacilityByAorIdResponseItem,
  FacilityImportResponse,
  FacilityResponse,
} from "@/src/types/facility.types";

export interface FacilityState {
  facilities: Facility[];
  facilitiesByAorId: FacilityByAorIdResponseItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  loading: boolean;
  error: string | null;
  importResult?: FacilityImportResponse | null;
}

export const getFacilities = createAsyncThunk<
  FacilityResponse,
  {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  { rejectValue: string }
>("facilities/getFacilities", async (params, thunkAPI) => {
  try {
    const response = await fetchFacilities(params);
    return response.data.data as FacilityResponse;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch facilities"),
    );
  }
});

export const createFacilityThunk = createAsyncThunk<
  AddFacilityResponseDto,
  AddFacilityRequestDto,
  { rejectValue: string }
>("facilities/createFacility", async (payload, thunkAPI) => {
  try {
    const response = await addFacility(payload);
    return response;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to add facility"),
    );
  }
});

export const updateFacilityThunk = createAsyncThunk<
  AddFacilityResponseDto,
  { facilityId: string; payload: AddFacilityRequestDto }
>("facility/updateFacility", async ({ facilityId, payload }, thunkAPI) => {
  try {
    const response = await updateFacility(facilityId, payload);
    return response;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to update facility"),
    );
  }
});

export const deleteFacilityThunk = createAsyncThunk(
  "facility/deleteFacility",
  async (facilityId: string, thunkAPI) => {
    try {
      await deleteFacility(facilityId);
      return facilityId;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to delete facility"),
      );
    }
  },
);

export const importFacilityThunk = createAsyncThunk<
  FacilityImportResponse,
  FormData,
  { rejectValue: string }
>("facility/import", async (payload, thunkAPI) => {
  try {
    const response = await importFacility(payload);
    return response;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to import facility"),
    );
  }
});

export const fetchFacilitiesByAorId = createAsyncThunk<
  FacilityByAorIdResponseItem[],
  { aorId: string; search?: string },
  { rejectValue: string }
>("facilities/fetchByAorId", async ({ aorId, search }, thunkAPI) => {
  try {
    const response = await getFacilitiesByAorId(aorId, search || "");

    return response as unknown as FacilityByAorIdResponseItem[];
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(error, "Failed to fetch facility for this AOR"),
    );
  }
});

const initialState: FacilityState = {
  facilities: [],
  facilitiesByAorId: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
  loading: false,
  error: null,
};

const facilitySlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: string; order: "asc" | "desc" }>,
    ) => {
      state.sortBy = action.payload.field;
      state.sortOrder = action.payload.order;
      state.page = 1;
    },
    clearFacilities: (state) => {
      state.facilities = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFacilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFacilities.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch facilities";
      })
      .addCase(createFacilityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFacilityThunk.fulfilled, (state, action) => {
        state.loading = false;

        const createdFacility = action.payload.data[0];

        if (createdFacility) {
          state.facilities.unshift({
            _id: createdFacility._id,
            name: createdFacility.name,
            createdBy: createdFacility.createdBy || "",
            createdAt: createdFacility.createdAt,
            updatedAt: createdFacility.updatedAt,
            aorName: createdFacility.aorId,
            companyId: createdFacility.companyId,
          });
          state.total += 1;
        }
      })
      .addCase(createFacilityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add facility";
      })
      .addCase(importFacilityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.importResult = null;
      })
      .addCase(
        importFacilityThunk.fulfilled,
        (state, action: PayloadAction<FacilityImportResponse>) => {
          state.loading = false;
          state.importResult = action.payload;

          if (action.payload.success.length > 0) {
            const newFacilities = action.payload.success.map((s) => ({
              _id: s.facilityIds[0],
              name: s.facilityNames,
              createdBy: "",
              createdAt: "",
              updatedAt: "",
              aorName: "",
            })) as Facility[];

            state.facilities = [...state.facilities, ...newFacilities];
            state.total += newFacilities.length;
          }
        },
      )
      .addCase(importFacilityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to import facilities";
      })
      .addCase(fetchFacilitiesByAorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilitiesByAorId.fulfilled, (state, action) => {
        state.loading = false;
        state.facilitiesByAorId = action.payload;
      })
      .addCase(fetchFacilitiesByAorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch facilities by AOR";
      })
      .addCase(updateFacilityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFacilityThunk.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          const index = state.facilities.findIndex(
            (f) => f._id === action.payload._id,
          );

          if (index !== -1) {
            state.facilities[index] = {
              ...state.facilities[index],
              ...action.payload,
            };
          }
        }
      })
      .addCase(updateFacilityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update facility";
      })
      .addCase(deleteFacilityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFacilityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = state.facilities.filter(
          (facility) => facility._id !== action.payload,
        );
      })
      .addCase(deleteFacilityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setPageSize, setSearch, setSort } =
  facilitySlice.actions;

export default facilitySlice.reducer;
