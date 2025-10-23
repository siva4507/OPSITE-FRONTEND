"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import Swal from "sweetalert2";
import { closeAlert } from "@/src/store/slices/alertSlice";
import { GlobalStyles } from "@mui/material";

const GlobalAlert = () => {
  const { open, message, type } = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      Swal.fire({
        icon: type, // "success" | "error" | "warning" | "info" | "question"
        text: message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "custom-swal-toast",
          icon: "custom-swal-icon",
        },
        didClose: () => {
          dispatch(closeAlert());
        },
      });
    }
  }, [open, message, type, dispatch]);

  return (
    <GlobalStyles
      styles={{
        ".custom-swal-toast": {
          padding: "8px 8px !important",
          fontSize: "0.75rem !important",
          minHeight: "auto !important",
        },
        ".custom-swal-icon": {
          width: "1rem !important",
          height: "1.65rem !important",
          margin: "0 8px 0 0 !important",
        },
        ".swal2-toast": {
          alignItems: "center !important",
        },
        ".swal2-title": {
          fontSize: "0.9rem !important",
          padding: "0 !important",
        },
        ".swal2-container": {
          zIndex: "2000 !important",
        },
      }}
    />
  );
};

export default GlobalAlert;
