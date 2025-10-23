import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCategories,
  addCategory,
  editCategory,
  deleteCategory,
} from "@/src/services/categoryService";
import {
  CategoryState,
  Category,
  AddCategoryRequestDto,
} from "@/src/types/category.types";
import { getErrorMessage } from "@/src/utils/config";

// Initial state
const initialState: CategoryState = {
  categories: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const getCategories = createAsyncThunk(
  "categories/getCategories",
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
      const response = await fetchCategories(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch categories"),
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const response = await addCategory(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add category"));
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (
    {
      categoryId,
      payload,
    }: { categoryId: string; payload: AddCategoryRequestDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await editCategory(categoryId, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update category"),
      );
    }
  },
);

export const removeCategory = createAsyncThunk(
  "categories/removeCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await deleteCategory(categoryId);
      return { categoryId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete category"),
      );
    }
  },
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategories: (state) => {
      state.categories = [];
      state.total = 0;
      state.page = 1;
      state.pageSize = 10;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCategories.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Category[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.unshift(action.payload);
          state.total += 1;
        },
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          const index = state.categories.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.categories[index] = action.payload;
          }
        },
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeCategory.fulfilled,
        (
          state,
          action: PayloadAction<{ categoryId: string; message: string }>,
        ) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (c) => c._id !== action.payload.categoryId,
          );
          state.total = state.total - 1;
        },
      )
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCategories } = categorySlice.actions;
export default categorySlice.reducer;
