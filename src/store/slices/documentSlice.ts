import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserFolders,
  renameFolder as renameFolderService,
  deleteFolder as deleteFolderService,
  createFolder as createFolderService,
  uploadFile as uploadFileService,
  fetchUserFoldersSearch,
} from "@/src/services/documentService";
import {
  DocumentFolder,
  CreateFolderRequest,
  UploadFileRequest,
} from "@/src/dto/document.dto";
import { GRID_VIEW, LIST_VIEW } from "@/src/utils/constant";
import { getErrorMessage } from "@/src/utils/config";

export const getUserFolders = createAsyncThunk(
  "documents/getUserFolders",
  async (
    args: {
      id?: string;
      page?: number;
      recent?: boolean;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
    thunkAPI,
  ) => {
    try {
      const response = await fetchUserFolders(
        args.id,
        args.page,
        args.recent,
        args.sortBy,
        args.sortOrder,
      );
      return {
        children: response.data.children,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
        id: args.id,
        recent: args.recent,
        sortBy: args.sortBy,
        sortOrder: args.sortOrder,
      };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to search user folders"),
      );
    }
  },
);

export const renameFolder = createAsyncThunk(
  "documents/renameFolder",
  async ({ id, name }: { id: string; name: string }, thunkAPI) => {
    try {
      await renameFolderService(id, name);
      return { id, name };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to rename folder"),
      );
    }
  },
);

export const deleteFolder = createAsyncThunk(
  "documents/deleteFolder",
  async (id: string, thunkAPI) => {
    try {
      await deleteFolderService(id);
      return id;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to delete folder"),
      );
    }
  },
);

export const createFolder = createAsyncThunk(
  "documents/createFolder",
  async (data: CreateFolderRequest, thunkAPI) => {
    try {
      const response = await createFolderService(data);
      const childrenArr = Array.isArray(response.data.children)
        ? response.data.children
        : [];
      const newFolder = childrenArr[childrenArr.length - 1];
      return { newFolder, parentId: data.parentId };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to create folder"),
      );
    }
  },
);

export const uploadFile = createAsyncThunk(
  "documents/uploadFile",
  async (data: UploadFileRequest, thunkAPI) => {
    try {
      const response = await uploadFileService(data);
      return response;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to upload file"),
      );
    }
  },
);

export const getUserFoldersSearch = createAsyncThunk(
  "documents/getUserFoldersSearch",
  async (
    args: {
      search: string;
      id?: string;
      page?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
    thunkAPI,
  ) => {
    try {
      const response = await fetchUserFoldersSearch(
        args.search,
        args.id,
        args.page,
        args.sortBy,
        args.sortOrder,
      );
      return {
        children: response.data.children,
        total: response.data.total,
        page: response.data.page,
        totalPages: response.data.totalPages,
        id: args.id,
        search: args.search,
        sortBy: args.sortBy,
        sortOrder: args.sortOrder,
      };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to search user folders"),
      );
    }
  },
);

interface DocumentState {
  folders: DocumentFolder[];
  loading: boolean;
  error: string | null;
  children: DocumentFolder[] | null;
  childrenLoading: boolean;
  childrenError: string | null;
  total: number;
  page: number;
  totalPages: number;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  viewMode: typeof GRID_VIEW | typeof LIST_VIEW;
  renameLoading?: boolean;
  renameError?: string | null;
  deleteLoading?: boolean;
  deleteError?: string | null;
  createLoading?: boolean;
  createError?: string | null;
  uploadLoading?: boolean;
  uploadError?: string | null;
  uploadSuccess?: boolean;
  searchResults?: DocumentFolder[];
  searchLoading?: boolean;
  searchError?: string | null;
  searchTotal?: number;
  searchPage?: number;
  searchTotalPages?: number;
}



const initialState: DocumentState = {
  folders: [],
  loading: false,
  error: null,
  children: null,
  childrenLoading: false,
  childrenError: null,
  total: 0,
  page: 1,
  totalPages: 1,
  sortBy: "updatedAt",
  sortOrder: "desc",
  viewMode: "grid",
  renameLoading: false,
  renameError: null,
  deleteLoading: false,
  deleteError: null,
  createLoading: false,
  createError: null,
  uploadLoading: false,
  uploadError: null,
  uploadSuccess: false,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchTotal: 0,
  searchPage: 1,
  searchTotalPages: 1,
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.searchResults = [];
      state.searchLoading = false;
      state.searchError = null;
      state.searchTotal = 0;
      state.searchPage = 1;
      state.searchTotalPages = 1;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("documentViewMode", action.payload);
      }
    },
    resetSortToDefaults(state) {
      state.sortBy = "updatedAt";
      state.sortOrder = "desc";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserFolders.pending, (state, action) => {
        if (action.meta.arg && action.meta.arg.id) {
          state.childrenLoading = true;
          state.childrenError = null;
        } else {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(getUserFolders.fulfilled, (state, action) => {
        if (action.meta.arg && action.meta.arg.id) {
          state.childrenLoading = false;
          state.children = action.payload.children;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        } else {
          state.loading = false;
          state.folders = action.payload.children;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
        state.sortBy = action.payload.sortBy;
        state.sortOrder = action.payload.sortOrder;
      })
      .addCase(getUserFolders.rejected, (state, action) => {
        if (action.meta.arg && action.meta.arg.id) {
          state.childrenLoading = false;
          state.childrenError = action.payload as string;
        } else {
          state.loading = false;
          state.error = action.payload as string;
        }
      })
      .addCase(renameFolder.pending, (state) => {
        state.renameLoading = true;
        state.renameError = null;
      })
      .addCase(renameFolder.fulfilled, (state, action) => {
        state.renameLoading = false;
        state.renameError = null;
        state.folders = state.folders.map((f) =>
          f._id === action.payload.id ? { ...f, name: action.payload.name } : f,
        );
        if (state.children) {
          state.children = state.children.map((f) =>
            f._id === action.payload.id
              ? { ...f, name: action.payload.name }
              : f,
          );
        }
      })
      .addCase(renameFolder.rejected, (state, action) => {
        state.renameLoading = false;
        state.renameError = action.payload as string;
      })
      .addCase(deleteFolder.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.folders = state.folders.filter(
          (f) => f && f._id !== action.payload,
        );
        if (state.children) {
          state.children = state.children.filter(
            (f) => f && f._id !== action.payload,
          );
        }
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      })
      .addCase(createFolder.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        if (action.payload.parentId) {
          if (state.children) {
            state.children = [...state.children, action.payload.newFolder];
          }
        } else {
          state.folders = [...state.folders, action.payload.newFolder];
        }
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadError = null;
        state.uploadSuccess = true;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.payload as string;
        state.uploadSuccess = false;
      })
      .addCase(getUserFoldersSearch.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(getUserFoldersSearch.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.children;
        state.searchTotal = action.payload.total;
        state.searchPage = action.payload.page;
        state.searchTotalPages = action.payload.totalPages;
        state.sortBy = action.payload.sortBy;
        state.sortOrder = action.payload.sortOrder;
      })
      .addCase(getUserFoldersSearch.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      });
  },
});

export const { clearSearchResults, setViewMode, resetSortToDefaults } =
  documentSlice.actions;

export default documentSlice.reducer;
