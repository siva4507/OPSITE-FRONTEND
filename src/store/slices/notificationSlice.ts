import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserNotifications,
  Notification,
  NotificationParams,
  NotificationResponse,
  markAllAsRead as markAllAsReadService,
  markNotificationAsReadById,
  NotificationUpdateResponse,
} from "@/src/services/notificationService";
import { getErrorMessage } from "@/src/utils/config";

export interface NotificationState {
  notifications: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

export const getUserNotifications = createAsyncThunk<
  NotificationResponse["data"],
  NotificationParams,
  { rejectValue: string }
>("notifications/getUserNotifications", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchUserNotifications(params);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to fetch notifications"),
    );
  }
});

// 🔹 Mark all notifications as read (API call)
export const markAllNotificationsAsRead = createAsyncThunk<
  NotificationUpdateResponse,
  void,
  { rejectValue: string }
>("notifications/markAllAsRead", async (_, { rejectWithValue }) => {
  try {
    const response = await markAllAsReadService();
    return response.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to mark all as read"),
    );
  }
});

// 🔹 Mark single notification as read (API call)
export const markNotificationAsRead = createAsyncThunk<
  { id: string; response: NotificationUpdateResponse },
  string,
  { rejectValue: string }
>("notifications/markAsRead", async (id, { rejectWithValue }) => {
  try {
    const response = await markNotificationAsReadById(id);
    return { id, response: response.data };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to mark as read"));
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserNotifications.fulfilled,
        (state, action: PayloadAction<NotificationResponse["data"]>) => {
          state.loading = false;
          state.notifications = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        },
      )
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })

      // 🔹 Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      })

      // 🔹 Mark single as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload.id ? { ...n, isRead: true } : n,
        );
      });
  },
});

export default notificationSlice.reducer;
