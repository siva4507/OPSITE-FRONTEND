"use client";

import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useNotificationSocket } from "@/src/hooks/useNotification";
import { useDispatch, useSelector } from "react-redux";
import { setRefetch } from "@/src/store/slices/authSlice";
import { NotificationTypes } from "@/src/utils/constant";
import { RootState } from "@/src/store/store";
import { UserRole } from "@/src/types/auth.types";

interface Props {
  userId: string;
}

const NotificationListener: React.FC<Props> = ({ userId }) => {
  const { notifications } = useNotificationSocket(userId);
  const dispatch = useDispatch();

  const selectedRole = useSelector(
    (state: RootState) => state.auth.selectedRole,
  );

  useEffect(() => {
    if (notifications.length === 0) return;

    const latest = notifications[0];

    const shouldShowNotification =
      (latest.type === NotificationTypes.TIMER_EVENT && latest.self === true) ||
      latest.type === NotificationTypes.BREAK_PROMPT ||
      latest.type === NotificationTypes.AOR_ENDED_BY_OTHER;

    if (!shouldShowNotification) return;

    if (selectedRole !== UserRole.ActiveController) return;

    Swal.fire({
      title: latest.title,
      text: latest.message,
      icon: "info",
      position: "center",
      showConfirmButton: true,
      confirmButtonText: "Close",
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "transparent",
      didOpen: () => {
        const popup = document.querySelector(".swal2-popup") as HTMLElement;
        if (popup) {
          Object.assign(popup.style, {
            borderRadius: "8px",
            background: "#1A1A1A26",
            color: "#fff",
            padding: "16px",
            overflow: "visible",
            minWidth: "280px",
            boxShadow: `
            8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
            -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
            0px 0px 20.8px -5.2px #FFFFFF33 inset,
            0px 10px 60px 0px #0000001A
          `,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            marginBottom: "6px",
          });
        }

        const overlay = document.querySelector(
          ".swal2-container",
        ) as HTMLElement;
        if (overlay) {
          Object.assign(overlay.style, {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          });
        }

        const confirmButton = document.querySelector(
          ".swal2-confirm",
        ) as HTMLElement;
        if (confirmButton) {
          Object.assign(confirmButton.style, {
            backgroundColor: "#3D96E1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          });
        }
      },
    }).then(() => {
      if (latest.type === NotificationTypes.AOR_ENDED_BY_OTHER) {
        window.location.reload();
        dispatch(setRefetch(true));
      }
    });
  }, [notifications, dispatch, selectedRole]);

  return null;
};

export default NotificationListener;
