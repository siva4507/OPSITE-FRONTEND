import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/src/hooks/redux";
import { getProfile } from "@/src/store/slices/profileSlice";
import { NotificationTypes, NotificationTitles } from "@/src/utils/constant";
import {
  fetchCurrentShiftScore,
  fetchTimersAction,
} from "../store/slices/fatigueSlice";
import { getWorkStats } from "../store/slices/dashboardSlice";

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: string;
  self: boolean;
  referenceId?: string;
  createdAt: string;
}

interface UseNotificationReturn {
  notifications: NotificationPayload[];
  socket: Socket | null;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

export const useNotificationSocket = (
  userId: string,
): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("newNotification", (payload: NotificationPayload) => {
      setNotifications((prev) => [payload, ...prev]);

      if (
        payload.type === NotificationTypes.SYSTEM &&
        payload.title.toLowerCase().includes(NotificationTitles.PROFILE)
      ) {
        dispatch(getProfile());
      }

      if (payload.type === NotificationTypes.TIMER_EVENT && !payload.self) {
        dispatch(fetchTimersAction());
      }

      if (payload.type === NotificationTypes.FATIGUE_UPDATE) {
        dispatch(fetchCurrentShiftScore());
      }

      if (payload.type === NotificationTypes.HOUR_OF_SERVICE) {
        dispatch(getWorkStats());
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  return { notifications, socket: socketRef.current };
};
