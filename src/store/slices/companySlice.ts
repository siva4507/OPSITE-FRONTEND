import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  addCompany,
  editCompany,
  deleteCompany,
} from "@/src/services/companyService";
import {
  Company,
  CompanyListResponse,
  AddCompanyRequestDto,
  AddCompanyResponseDto,
} from "@/src/types/company.types";
import { getErrorMessage } from "@/src/utils/config";

interface CompanyState {
  companies: Company[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const getCompanies = createAsyncThunk<
  CompanyListResponse,
  {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
>("company/fetchCompanies", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchCompanies(params);
    return response.data as CompanyListResponse;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch Companies"));
  }
});

export const addCompanyThunk = createAsyncThunk<
  AddCompanyResponseDto,
  AddCompanyRequestDto
>("company/addCompany", async (payload, { rejectWithValue }) => {
  try {
    const response = await addCompany(payload);
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to add company"));
  }
});

export const editCompanyThunk = createAsyncThunk<
  AddCompanyResponseDto,
  { companyId: string; payload: AddCompanyRequestDto }
>(
  "company/editCompany",
  async ({ companyId, payload }, { rejectWithValue }) => {
    try {
      const response = await editCompany(companyId, payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update company"),
      );
    }
  },
);

export const deleteCompanyThunk = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("company/deleteCompany", async (companyId, { rejectWithValue }) => {
  try {
    const response = await deleteCompany(companyId);
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete company"));
  }
});

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    resetCompanyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCompanies.fulfilled,
        (state, action: PayloadAction<CompanyListResponse>) => {
          state.loading = false;
          state.companies = action.payload.data.data;
          state.total = action.payload.data.total;
          state.page = action.payload.data.page;
          state.pageSize = action.payload.data.pageSize;
          state.totalPages = action.payload.data.totalPages;
        },
      )
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCompanyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCompanyThunk.fulfilled,
        (state, action: PayloadAction<AddCompanyResponseDto>) => {
          state.loading = false;
          state.companies.unshift(action.payload.data);
          state.total += 1;
        },
      )
      .addCase(addCompanyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editCompanyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCompanyThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCompany = action.payload.data;
        const index = state.companies.findIndex(
          (c) => c._id === updatedCompany._id,
        );
        if (index !== -1) {
          state.companies[index] = updatedCompany;
        }
      })
      .addCase(editCompanyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCompanyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompanyThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (c) => c._id !== action.meta.arg,
        );
        state.total -= 1;
      })
      .addCase(deleteCompanyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;
