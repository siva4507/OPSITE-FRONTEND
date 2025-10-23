import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAssignedAORs,
  fetchCategories,
  saveLogEntries,
  fetchLogEntriesByAor,
  toggleImportantLogEntry,
  deleteLogEntry,
  updateLogEntry,
  exportLogbookPdf,
} from "@/src/services/electronicLogService";
import {
  AOR,
  Category,
  LogEntrySavePayload,
  LogEntrySaveResponse,
  LogEntryDto,
  LogEntryUpdatePayload,
} from "@/src/dto/electronicLog.dto";
import { getErrorMessage } from "@/src/utils/config";

export const getAssignedAORs = createAsyncThunk(
  "electronicLog/getAssignedAORs",
  async (_, thunkAPI) => {
    try {
      const response = await fetchAssignedAORs();
      return {
        aors: response.data.aors,
        recentAor: response.data.recentAor,
      };
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to fetch assigned AORs"),
      );
    }
  },
);

export const getCategories = createAsyncThunk(
  "electronicLog/getCategories",
  async (_, thunkAPI) => {
    try {
      const response = await fetchCategories();
      return response;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to fetch categories"),
      );
    }
  },
);

export const saveLogEntriesThunk = createAsyncThunk<
  LogEntrySaveResponse,
  { payload: LogEntrySavePayload[]; files: File[] },
  { rejectValue: string }
>("electronicLog/saveLogEntries", async ({ payload, files }, thunkAPI) => {
  try {
    return await saveLogEntries(payload, files);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to save log entries"),
    );
  }
});

export const getLogEntriesByAor = createAsyncThunk(
  "electronicLog/getLogEntriesByAor",
  async (
    params: {
      shiftAorId: string;
      sortBy?: string;
      sortOrder?: string;
      search?: string;
      filter?: string;
      page?: number;
      limit?: number;
    },
    thunkAPI,
  ) => {
    try {
      const response = await fetchLogEntriesByAor(params.shiftAorId, {
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        search: params.search,
        filter: params.filter,
        page: params.page,
        limit: params.limit,
      });

      return response.data.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to fetch logs"),
      );
    }
  },
);

export const toggleLogEntryImportant = createAsyncThunk(
  "electronicLog/toggleLogEntryImportant",
  async (rowId: string, thunkAPI) => {
    try {
      const response = await toggleImportantLogEntry(rowId);
      return response;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to update importance"),
      );
    }
  },
);

export const updateLogEntryThunk = createAsyncThunk<
  LogEntrySaveResponse,
  { logId: string; payload: LogEntryUpdatePayload; files: File[] },
  { rejectValue: string }
>("logbook/updateLogEntry", async ({ logId, payload, files }, thunkAPI) => {
  try {
    const response = await updateLogEntry(logId, payload, files);
    return response;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to update log entry"),
    );
  }
});

export const deleteLogEntryById = createAsyncThunk(
  "electronicLog/deleteLogEntryById",
  async (logEntryId: string, thunkAPI) => {
    try {
      const response = await deleteLogEntry(logEntryId);
      return response.data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to delete log entry"),
      );
    }
  },
);

export const exportLogbookPdfThunk = createAsyncThunk<
  Blob,
  {
    shiftAorId: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    filter?: string;
    page?: number;
    limit?: number;
    userTimeZone?: string;
  },
  { rejectValue: string }
>("electronicLog/exportLogbookPdf", async (params, thunkAPI) => {
  try {
    const pdfBlob = await exportLogbookPdf(params.shiftAorId, {
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      search: params.search,
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      userTimeZone: params.userTimeZone,
    });

    return pdfBlob;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to export PDF"),
    );
  }
});

export interface AddRowState {
  categoryIds: Record<number, string>;
  descriptions: Record<number, string>;
  tags: Record<number, string[]>;
  tagInput: Record<number, string>;
  uploadedFileNames: Record<number, string>;
  facilities: Record<number, string>;
}

interface AORState {
  filterTab: "all" | "my" | "imp";
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  currentLimit: number;
  search: string;
}

interface ElectronicLogState {
  aors: AOR[];
  recentAor: string[];
  aorLoading: boolean;
  loading: boolean;
  error: string | null;
  activeTab: number;
  search: string;
  showAddRow: boolean;
  logEntries: LogEntryDto[];
  selectedAOR: string | null;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  saveLogEntriesLoading: boolean;
  saveLogEntriesError: string | null;
  saveLogEntriesSuccess: boolean;
  updateLogEntryLoading: boolean;
  updateLogEntryError: string | null;
  updateLogEntrySuccess: boolean;
  addRowState: Record<string, AddRowState>;
  totalPages: number;
  pageSize: number;
  totalEntries: number;
  aorStates: Record<string, AORState>;
  tableLoading: boolean;
  shouldRestoreState: boolean;
}

const initialAddRowState = (): AddRowState => ({
  categoryIds: {},
  descriptions: {},
  tags: {},
  tagInput: {},
  uploadedFileNames: {},
  facilities: {},
});

const initialState: ElectronicLogState = {
  aors: [],
  recentAor: [],
  aorLoading: false,
  loading: false,
  error: null,
  activeTab: 0,
  search: "",
  showAddRow: false,
  logEntries: [],
  selectedAOR: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  saveLogEntriesLoading: false,
  saveLogEntriesError: null,
  saveLogEntriesSuccess: false,
  updateLogEntryLoading: false,
  updateLogEntryError: null,
  updateLogEntrySuccess: false,
  addRowState: {},
  totalPages: 1,
  pageSize: 9,
  totalEntries: 0,
  aorStates: {},
  tableLoading: false,
  shouldRestoreState: false,
};

const getAORState = (state: ElectronicLogState, aorId: string): AORState => {
  if (!state.aorStates[aorId]) {
    state.aorStates[aorId] = {
      filterTab: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      currentPage: 1,
      currentLimit: 100,
      search: "",
    };
  }
  return state.aorStates[aorId];
};

const electronicLogSlice = createSlice({
  name: "electronicLog",
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setShowAddRow(state, action) {
      state.showAddRow = action.payload;
    },
    setSelectedAOR(state, action) {
      state.selectedAOR = action.payload;
    },
    clearLogEntries(state) {
      state.logEntries = [];
    },
    clearError(state) {
      state.error = null;
    },
    clearAddRowState(state, action: PayloadAction<{ aorId: string }>) {
      const { aorId } = action.payload;
      state.addRowState[aorId] = initialAddRowState();
    },
    updateAddRowCategory(
      state,
      action: PayloadAction<{ aorId: string; rowId: number; value: string }>,
    ) {
      const { aorId, rowId, value } = action.payload;
      if (!state.addRowState[aorId])
        state.addRowState[aorId] = initialAddRowState();
      state.addRowState[aorId].categoryIds[rowId] = value;
    },
    updateAddRowDescription(
      state,
      action: PayloadAction<{ aorId: string; rowId: number; value: string }>,
    ) {
      const { aorId, rowId, value } = action.payload;
      if (!state.addRowState[aorId])
        state.addRowState[aorId] = initialAddRowState();
      state.addRowState[aorId].descriptions[rowId] = value;
    },
    updateAddRowTags(
      state,
      action: PayloadAction<{ aorId: string; rowId: number; tags: string[] }>,
    ) {
      const { aorId, rowId, tags } = action.payload;
      if (!state.addRowState[aorId])
        state.addRowState[aorId] = initialAddRowState();
      state.addRowState[aorId].tags[rowId] = tags;
    },
    updateAddRowTagInput(
      state,
      action: PayloadAction<{ aorId: string; rowId: number; value: string }>,
    ) {
      const { aorId, rowId, value } = action.payload;
      if (!state.addRowState[aorId])
        state.addRowState[aorId] = initialAddRowState();
      state.addRowState[aorId].tagInput[rowId] = value;
    },
    removeAddRowLastTag(
      state,
      action: PayloadAction<{ aorId: string; rowId: number }>,
    ) {
      const { aorId, rowId } = action.payload;
      const tags = state.addRowState[aorId]?.tags?.[rowId];
      if (tags && tags.length > 0) {
        tags.pop();
      }
    },
    updateAddRowFile(
      state,
      action: PayloadAction<{ aorId: string; rowId: number; fileName: string }>,
    ) {
      const { aorId, rowId, fileName } = action.payload;
      if (!state.addRowState[aorId]) {
        state.addRowState[aorId] = initialAddRowState();
      }
      state.addRowState[aorId].uploadedFileNames[rowId] = fileName;
    },
    toggleImportantOptimistic: (state, action: PayloadAction<string>) => {
      const rowId = action.payload;
      const entry = state.logEntries.find((log) => log._id === rowId);
      if (entry) {
        entry.isImportant = !entry.isImportant;
      }
    },
    updateAddRowFacility(
      state,
      action: PayloadAction<{
        aorId: string;
        rowId: number;
        facilities: string;
      }>,
    ) {
      const { aorId, rowId, facilities } = action.payload;
      if (!state.addRowState[aorId])
        state.addRowState[aorId] = initialAddRowState();
      state.addRowState[aorId].facilities[rowId] = facilities;
    },
    setAORFilterTab: (
      state,
      action: PayloadAction<{ aorId: string; filterTab: "all" | "my" | "imp" }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.filterTab = action.payload.filterTab;
    },
    setAORSortBy: (
      state,
      action: PayloadAction<{ aorId: string; sortBy: string }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.sortBy = action.payload.sortBy;
    },
    setAORSortOrder: (
      state,
      action: PayloadAction<{ aorId: string; sortOrder: "asc" | "desc" }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.sortOrder = action.payload.sortOrder;
    },
    setAORCurrentPage: (
      state,
      action: PayloadAction<{ aorId: string; currentPage: number }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.currentPage = action.payload.currentPage;
    },
    setAORCurrentLimit: (
      state,
      action: PayloadAction<{ aorId: string; currentLimit: number }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.currentLimit = action.payload.currentLimit;
    },
    setAORSearch: (
      state,
      action: PayloadAction<{ aorId: string; search: string }>,
    ) => {
      const aorState = getAORState(state, action.payload.aorId);
      aorState.search = action.payload.search;
    },
    clearAddRowData: (
      state,
      action: PayloadAction<{ aorId: string; rowId: number }>,
    ) => {
      const { aorId, rowId } = action.payload;
      if (state.addRowState[aorId]) {
        delete state.addRowState[aorId].categoryIds[rowId];
        delete state.addRowState[aorId].descriptions[rowId];
        delete state.addRowState[aorId].tags[rowId];
        delete state.addRowState[aorId].tagInput[rowId];
        delete state.addRowState[aorId].facilities[rowId];
      }
    },
    updateLogEntryInList: (
      state,
      action: PayloadAction<{
        logId: string;
        updatedData: Partial<LogEntryDto>;
      }>,
    ) => {
      const { logId, updatedData } = action.payload;
      const entryIndex = state.logEntries.findIndex(
        (entry) => entry._id === logId,
      );
      if (entryIndex !== -1) {
        state.logEntries[entryIndex] = {
          ...state.logEntries[entryIndex],
          ...updatedData,
        };
      }
    },
    setShouldRestoreState: (state, action: PayloadAction<boolean>) => {
      state.shouldRestoreState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssignedAORs.pending, (state) => {
        state.loading = true;
        state.aorLoading = true;
        state.error = null;
      })
      .addCase(getAssignedAORs.fulfilled, (state, action) => {
        const { aors, recentAor } = action.payload;
        state.loading = false;
        state.aorLoading = false;
        state.error = null;
        state.recentAor = recentAor;
        const sortedAors = [...aors].sort((a, b) => {
          const aHasShift = !!a.shiftId && !!a.shiftAorId;
          const bHasShift = !!b.shiftId && !!b.shiftAorId;

          // First, sort by shift presence
          if (aHasShift !== bHasShift)
            return Number(bHasShift) - Number(aHasShift);

          // Then, sort alphabetically by name (assuming 'name' property)
          return a.name.localeCompare(b.name);
        });

        state.aors = sortedAors;

        // Find the AOR with isActiveTab: true from the sorted list
        const activeIndex = sortedAors.findIndex(
          (aor) => aor.isActiveTab === true,
        );
        const finalActiveIndex = activeIndex !== -1 ? activeIndex : 0;

        state.activeTab = finalActiveIndex;
        state.selectedAOR = sortedAors[finalActiveIndex]?._id || null;

        // Initialize the active AOR's state with filter 'all'
        if (sortedAors[finalActiveIndex]?._id) {
          const activeAorId = sortedAors[finalActiveIndex]._id;
          if (!state.aorStates[activeAorId]) {
            state.aorStates[activeAorId] = {
              filterTab: "all",
              sortBy: "createdAt",
              sortOrder: "desc",
              currentPage: 1,
              currentLimit: 100,
              search: "",
            };
          }
        }
      })
      .addCase(getAssignedAORs.rejected, (state, action) => {
        state.loading = false;
        state.aorLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
        state.categoriesError = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload as string;
      })
      // Save Log Entries
      .addCase(saveLogEntriesThunk.pending, (state) => {
        state.saveLogEntriesLoading = true;
        state.saveLogEntriesError = null;
        state.saveLogEntriesSuccess = false;
      })
      .addCase(saveLogEntriesThunk.fulfilled, (state) => {
        state.saveLogEntriesLoading = false;
        state.saveLogEntriesSuccess = true;
        state.saveLogEntriesError = null;
      })
      .addCase(saveLogEntriesThunk.rejected, (state, action) => {
        state.saveLogEntriesLoading = false;
        state.saveLogEntriesError = action.payload as string;
        state.saveLogEntriesSuccess = false;
      })
      .addCase(getLogEntriesByAor.pending, (state) => {
        state.loading = true;
        state.tableLoading = true;
      })
      
      .addCase(getLogEntriesByAor.fulfilled, (state, action) => {
        state.loading = false;
        state.tableLoading = false;
        state.logEntries = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalEntries = action.payload.total;

        // Update the AOR state with the values from the API call
        const { shiftAorId, page, limit } = action.meta.arg;

        if (shiftAorId && state.aorStates[shiftAorId]) {
          // Update with the actual values used in the API call
          state.aorStates[shiftAorId].currentPage = page || 1;
          state.aorStates[shiftAorId].currentLimit = limit || 100;
        }
      })
      .addCase(getLogEntriesByAor.rejected, (state, action) => {
        state.loading = false;
        state.tableLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLogEntryById.fulfilled, (state, action) => {
        state.logEntries = state.logEntries.filter(
          (log) => log.id !== action.meta.arg,
        );
      })
      .addCase(updateLogEntryThunk.pending, (state) => {
        state.updateLogEntryLoading = true;
        state.updateLogEntryError = null;
        state.updateLogEntrySuccess = false;
      })
      .addCase(updateLogEntryThunk.fulfilled, (state) => {
        state.updateLogEntryLoading = false;
        state.updateLogEntrySuccess = true;
        state.updateLogEntryError = null;
      })
      .addCase(updateLogEntryThunk.rejected, (state, action) => {
        state.updateLogEntryLoading = false;
        state.updateLogEntryError = action.payload as string;
        state.updateLogEntrySuccess = false;
      });
  },
});

export const {
  setActiveTab,
  setShowAddRow,
  setSelectedAOR,
  clearLogEntries,
  clearError,
  clearAddRowState,
  updateAddRowCategory,
  updateAddRowDescription,
  updateAddRowTags,
  updateAddRowTagInput,
  removeAddRowLastTag,
  updateAddRowFile,
  updateAddRowFacility,
  toggleImportantOptimistic,
  setAORSearch,
  setAORFilterTab,
  setAORSortOrder,
  setAORSortBy,
  setAORCurrentPage,
  setAORCurrentLimit,
  clearAddRowData,
  updateLogEntryInList,
  setShouldRestoreState,
} = electronicLogSlice.actions;

export default electronicLogSlice.reducer;
