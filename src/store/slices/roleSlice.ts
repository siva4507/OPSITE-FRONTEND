import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addRole,
  deleteRole,
  editRole,
  fetchRoles,
} from "@/src/services/roleService";
import { Role } from "@/src/types/role.types";
import { getErrorMessage } from "@/src/utils/config";

interface RoleState {
  roles: Role[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error?: string;
}

const initialState: RoleState = {
  roles: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
};

export const fetchRolesThunk = createAsyncThunk<
  {
    roles: Role[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  },
  | {
      sortBy?: string;
      sortOrder?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  | undefined,
  { rejectValue: string }
>("roles/fetchRoles", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchRoles(params);
    const { data } = response.data;
    return {
      roles: data.data,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch roles"));
  }
});

export const addRoleThunk = createAsyncThunk<
  Role,
  { name: string },
  { rejectValue: string }
>("roles/addRole", async (payload, { rejectWithValue }) => {
  try {
    const response = await addRole(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to add role"));
  }
});

export const editRoleThunk = createAsyncThunk<
  Role,
  { roleId: string; name: string },
  { rejectValue: string }
>("roles/editRole", async ({ roleId, name }, { rejectWithValue }) => {
  try {
    const response = await editRole(roleId, { name });
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to edit role"));
  }
});

export const deleteRoleThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("roles/deleteRole", async (roleId, { rejectWithValue }) => {
  try {
    await deleteRole(roleId);
    return roleId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete role"));
  }
});

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(addRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(addRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(editRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(
          (r) => r._id === action.payload._id,
        );
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(editRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role._id !== action.payload);
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
