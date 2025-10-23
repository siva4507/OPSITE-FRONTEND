import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  addUser,
  deleteUser,
  editUser,
  fetchUsers,
  importUsers,
} from "@/src/services/userServices";
import {
  FetchUsersParams,
  FetchUsersResponse,
  User,
  UserResponseDto,
  BulkImportResponse,
} from "@/src/types/user.types";
import { getErrorMessage } from "@/src/utils/config";

interface UserState {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  importResult?: BulkImportResponse | null;
}

const initialState: UserState = {
  users: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  loading: false,
  error: null,
  importResult: null,
};

// Fetch users thunk
export const fetchUsersThunk = createAsyncThunk<
  FetchUsersResponse["data"],
  FetchUsersParams | undefined,
  { rejectValue: string }
>("users/fetchUsers", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchUsers(params);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
  }
});

// Add user thunk
export const addUserThunk = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("users/add", async (payload, { rejectWithValue }) => {
  try {
    const user: UserResponseDto = await addUser(payload);
    return user as unknown as User;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to add user"));
  }
});

export const importUsersThunk = createAsyncThunk<
  BulkImportResponse,
  FormData,
  { rejectValue: string }
>("users/import", async (payload, { rejectWithValue }) => {
  try {
    const response = await importUsers(payload);
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to import users"));
  }
});

export const editUserThunk = createAsyncThunk<
  User,
  { userId: string; payload: FormData },
  { rejectValue: string }
>("users/edit", async ({ userId, payload }, { rejectWithValue }) => {
  try {
    const updatedUser: UserResponseDto = await editUser(userId, payload);
    return updatedUser as unknown as User;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update user"));
  }
});

export const deleteUserThunk = createAsyncThunk<
  { _id: string; username: string; email: string },
  string,
  { rejectValue: string }
>("users/delete", async (userId, { rejectWithValue }) => {
  try {
    const data = await deleteUser(userId);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete user"));
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersThunk.fulfilled,
        (state, action: PayloadAction<FetchUsersResponse["data"]>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(addUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      })
      .addCase(editUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(editUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload._id);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      })
      .addCase(importUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.importResult = null;
      })
      .addCase(
        importUsersThunk.fulfilled,
        (state, action: PayloadAction<BulkImportResponse>) => {
          state.loading = false;
          state.importResult = action.payload;
          if (action.payload.success?.length > 0) {
            const newUsers = action.payload.success.map((s) => ({
              _id: s.userId,
              email: s.email,
              username: s.email.split("@")[0],
            })) as User[];
            state.users = [...state.users, ...newUsers];
          }
        },
      )
      .addCase(importUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to import users";
      });
  },
});

export default userSlice.reducer;
