"use client";

import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNotificationSocket } from "@/src/hooks/useNotification";

interface Props {
  userId: string;
}

const NotificationListener: React.FC<Props> = ({ userId }) => {
  const { notifications } = useNotificationSocket(userId);

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[0];

    Swal.fire({
      title: latest.title,
      text: latest.message,
      icon:
        latest.type === "error"
          ? "error"
          : latest.type === "success"
            ? "success"
            : "info",
      timer: 5000,
      timerProgressBar: true,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
    });
  }, [notifications]);

  return null;
};

export default NotificationListener;
