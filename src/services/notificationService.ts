// src/services/notificationService.ts
import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

// Notification type based on your API response
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Pagination and filters for notifications
export interface NotificationParams {
  page?: number;
  limit?: number;
  read?: boolean;
}

// API response structure
export interface NotificationResponse {
  total: number;
  message: string;
  data: {
    data: Notification[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface NotificationUpdateResponse {
  message: string;
  data: {
    modifiedCount: number;
  };
}

/**
 * Fetch notifications for a user with optional pagination and filters
 * @param userId - The ID of the user
 * @param params - Optional pagination and filter parameters
 */
export const fetchUserNotifications = (params?: NotificationParams) => {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.read !== undefined) query.append("read", String(params.read));

  return api.get<NotificationResponse>(
    `${API_ENDPOINTS.NOTIFICATIONS}?${query.toString()}`,
  );
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = () =>
  api.patch<NotificationUpdateResponse>(API_ENDPOINTS.NOTIFICATION_READALL);

/**
 * Mark a single notification as read by ID
 */
export const markNotificationAsReadById = (id: string) =>
  api.patch<NotificationUpdateResponse>(
    `${API_ENDPOINTS.NOTIFICATION_READID}/${id}`,
  );
