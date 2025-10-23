import { UserRole } from "@/src/types/auth.types";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/types";



export const getPrimaryRole = (roles: string[] | undefined | null): string => {
  if (!roles?.length) return UserRole.ActiveController;
  if (roles.includes(UserRole.Administrator)) return UserRole.Administrator;
  if (roles.includes(UserRole.ActiveController))
    return UserRole.ActiveController;
  if (roles.includes(UserRole.Observer)) return UserRole.Observer;

  return roles[0];
};

export const presetColors = [
  "#000000",
  "#FFB800",
  "#FF6B6B",
  "#FF3F2F",
  "#3D96E1",
  "#A259FF",
  "#6C63FF",
  "#F66104",
];

export const ACCEPTED_FILE_TYPES = `
  .pdf,
  image/png,
  image/jpeg,
  image/jpg,
  image/gif,
  application/msword,
  text/plain,
  text/csv,
  application/ms-excel,
  video/mp4,
  audio/mpeg,
  audio/wav
`.replace(/\s+/g, "");

export const ACCEPTED_IMAGE_TYPES = `
  image/png,
  image/jpeg,
  image/jpg,
`.replace(/\s+/g, "");

export const DOC_TABS = ["All", "Recent", "Search"];

export const DESCRIPTION_LENGTH = 1000;

export const FOLDER_LENDTH = 50;

export const FACILITY_TAGS = 6;

export function getErrorMessage(
  err: unknown,
  defaultMessage = "An error occurred",
): string {
  const axiosErr = err as AxiosError<ApiErrorResponse> | undefined;
  const msg = axiosErr?.response?.data?.message;

  if (Array.isArray(msg)) {
    return msg.join(", ");
  }

  return (
    msg ??
    (axiosErr?.message && axiosErr.message !== "Network Error"
      ? axiosErr.message
      : undefined) ??
    defaultMessage
  );
}

export const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateAlone = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);

  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
};
