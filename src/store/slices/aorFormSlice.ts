// src/store/slices/aorFormSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAorForms,
  deleteAorForm,
  fetchAorsWithTemplate,
  createAorTemplate,
  fetchFormTemplateById,
  editAorTemplate,
  fetchAorUserById,
} from "@/src/services/aorFormService";
import { getErrorMessage } from "@/src/utils/config";
import {
  AorForm,
  AorWithTemplate,
  CreateAorTemplateRequest,
  CreateAorTemplateResponse,
  FormTemplate,
  AorUser,
} from "@/src/types/aorForm.types";

interface AorFormState {
  forms: AorForm[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  aorsWithTemplate: AorWithTemplate[];
  loadingAors: boolean;
  errorAors: string | null;

  selectedFormTemplate: FormTemplate | null;
  loadingTemplate: boolean;
  errorTemplate: string | null;

  selectedUser: AorUser[];
  loadingUser: boolean;
  errorUser: string | null;
}

const initialState: AorFormState = {
  forms: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,

  aorsWithTemplate: [],
  loadingAors: false,
  errorAors: null,

  selectedFormTemplate: null,
  loadingTemplate: false,
  errorTemplate: null,

  selectedUser: [],
  loadingUser: false,
  errorUser: null,
};

// Async thunk to fetch AOR forms
export const getAorForms = createAsyncThunk(
  "aorForms/getAorForms",
  async (
    params: {
      sortBy?: string;
      sortOrder?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchAorForms(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch AOR forms"),
      );
    }
  },
);

export const removeAorForm = createAsyncThunk(
  "aorForms/removeAorForm",
  async (formId: string, { rejectWithValue }) => {
    try {
      const response = await deleteAorForm(formId);
      return { formId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete form"));
    }
  },
);

export const getAorsWithTemplate = createAsyncThunk(
  "aorForms/getAorsWithTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAorsWithTemplate();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch AORs with template"),
      );
    }
  },
);

export const createAorTemplateThunk = createAsyncThunk(
  "aorForms/createAorTemplate",
  async (payload: CreateAorTemplateRequest, { rejectWithValue }) => {
    try {
      const response = await createAorTemplate(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create AOR template"),
      );
    }
  },
);

export const getFormTemplateById = createAsyncThunk(
  "aorForms/getFormTemplateById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchFormTemplateById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch form template"),
      );
    }
  },
);

export const editAorTemplateThunk = createAsyncThunk(
  "aorForms/editAorTemplate",
  async (
    { id, payload }: { id: string; payload: CreateAorTemplateRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await editAorTemplate(id, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to edit AOR template"),
      );
    }
  },
);

export const getAorUserById = createAsyncThunk<
  AorUser[],
  string,
  { rejectValue: string }
>("aorForms/getAorUserById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetchAorUserById(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch AOR user"));
  }
});

const aorFormSlice = createSlice({
  name: "aorForms",
  initialState,
  reducers: {
    resetAorForms: (state) => {
      state.forms = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;

      state.aorsWithTemplate = [];
      state.errorAors = null;
    },
    clearSelectedFormTemplate: (state) => {
      state.selectedFormTemplate = null;
      state.loadingTemplate = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAorForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAorForms.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: AorForm[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.forms = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getAorForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeAorForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeAorForm.fulfilled,
        (state, action: PayloadAction<{ formId: string; message: string }>) => {
          state.loading = false;
          state.forms = state.forms.filter(
            (f) => f._id !== action.payload.formId,
          );
          state.total = state.total - 1;
        },
      )
      .addCase(removeAorForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getAorsWithTemplate.pending, (state) => {
        state.loadingAors = true;
        state.errorAors = null;
      })
      .addCase(
        getAorsWithTemplate.fulfilled,
        (state, action: PayloadAction<AorWithTemplate[]>) => {
          state.loadingAors = false;
          state.aorsWithTemplate = action.payload;
        },
      )
      .addCase(getAorsWithTemplate.rejected, (state, action) => {
        state.loadingAors = false;
        state.errorAors = action.payload as string;
      })
      .addCase(createAorTemplateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAorTemplateThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.forms = [action.payload, ...state.forms];
          state.total = state.total + 1;
        },
      )
      .addCase(createAorTemplateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getFormTemplateById.pending, (state) => {
        state.loadingTemplate = true;
        state.errorTemplate = null;
      })
      .addCase(
        getFormTemplateById.fulfilled,
        (state, action: PayloadAction<FormTemplate>) => {
          state.loadingTemplate = false;
          state.selectedFormTemplate = action.payload;
        },
      )
      .addCase(getFormTemplateById.rejected, (state, action) => {
        state.loadingTemplate = false;
        state.errorTemplate = action.payload as string;
      })
      .addCase(editAorTemplateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editAorTemplateThunk.fulfilled,
        (state, action: PayloadAction<CreateAorTemplateResponse>) => {
          state.loading = false;

          const updated = action.payload.data;

          // update in forms array
          state.forms = state.forms.map((f) =>
            f._id === updated._id ? { ...f, ...updated } : f,
          );

          // if editing the currently selected form, update it too
          if (state.selectedFormTemplate?._id === updated._id) {
            state.selectedFormTemplate = {
              ...state.selectedFormTemplate,
              ...updated,
            };
          }
        },
      )
      .addCase(editAorTemplateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAorUserById.pending, (state) => {
        state.loadingUser = true;
        state.errorUser = null;
      })
      .addCase(
        getAorUserById.fulfilled,
        (state, action: PayloadAction<AorUser[]>) => {
          state.loadingUser = false;
          state.selectedUser = action.payload;
        },
      )
      .addCase(getAorUserById.rejected, (state, action) => {
        state.loadingUser = false;
        state.errorUser = action.payload as string;
      });
  },
});

export const { resetAorForms, clearSelectedFormTemplate } =
  aorFormSlice.actions;
export default aorFormSlice.reducer;
