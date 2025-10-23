import { WeatherIcon } from "../types/types";

export const imageUrls = {
  logo: "/images/logo.png",
  opsitelogo: "/images/opsite-logo.png",
  bgPic: "/images/bgPic.png",
  bgPicture: "/images/bg_pic.jpg",
  activeController: "/images/active.svg",
  administrator: "/images/admin.svg",
  observer: "/images/observer.svg",
  toggle: "/images/toggle.svg",
  shiftChange: "/images/shift.svg",
  logout: "/images/Logout.png",
  vector: "/images/Vector.png",
  alert: "/images/alert.svg",
  notification: "/images/notification.svg",
  climate: "/images/climate.png",
  add: "/images/Add.svg",
  save: "/images/save.svg",
  workers: "/images/workers.jpg",
  microphone: "/images/microphone.svg",
  esign: "/images/esign.svg",
  bg: "/images/bg.svg",
  addFolder: "/images/addFolder.svg",
  files: "/images/files.svg",
  pdf: "/images/pdf-file.svg",
  rename: "/images/rename.svg",
  delete: "/images/delete.svg",
  download: "/images/download.svg",
  fileIcon: "/images/fileIcon.svg",
  downloadFile: "/images/downloadFile.svg",
  favicon: "/images/opsite-favicon.png",
  micIcon: "/images/micicon.svg",
  edit: "/images/edit.svg",
  toggleIcon: "/images/toggleicon.svg",
  maximizeIcon: "/images/max.svg",
  minimizeIcon: "/images/min.svg",
  attachment: "/images/attachment.svg",
  diary: "/images/diary.svg",
  upload: "/images/upload-cloud.svg",
  weatherCloud: "/images/weatherCloud.svg",
  alarm: "/images/Frame.svg",
  pause: "/images/pause.svg",
  job: "/images/job.svg",
  breakTime: "/images/break-time.svg",
  book: "/images/book.svg",
  alertWhite: "/images/alert_white.svg",
  prismVert: "/images/prismVert.png",
  prismHoriz: "/images/prismHoriz.png",
  prismMain: "/images/prism_main.png",
};

export const navigationUrls = {
  dashboard: "/dashboard",
  shiftChange: "/dashboard/shift-change",
  logbook: "/dashboard/logbook",
  documents: "/dashboard/documents",
  help: "/dashboard/help",
  login: "/auth/login",
  signUp: "/auth/sign-up",
  forgotPassword: "/auth/forgot-password",
  onboardingRoleSelection: "/onboarding/role-selection",
  onboardingHoursRest: "/onboarding/hours-rest",
  onboardingObserver: "/onboarding/observer",
  onboardingAreaResponse: "/onboarding/area-response",
  onboardingInvite: "/onboarding/invite",
  esign: "/onboarding/esign",
  companies: "/dashboard/companies",
  user: "/dashboard/user",
  aor: "/dashboard/aor",
  categories: "/dashboard/categories",
  roles: "/dashboard/roles",
  themes: "/dashboard/themes",
  facility: "/dashboard/facility",
  qos: "/dashboard/qualityHours",
  aorforms: "/dashboard/aorforms",
  mitigation: "/dashboard/mitigation",
  sleepHours: "/dashboard/sleepHours",
  shiftHours: "/dashboard/shiftHours",
  hitchDay: "/dashboard/hitchDay",
  fatigueScore: "/dashboard/fatigueScore",
};

export const TOKEN_KEY = "auth_token";
export const OPEN_TABS_KEY = "auth_open_tabs";
export const TAB_ID_KEY = "auth_tab_id";

export const BACKGROUND_IMAGE = "image";
export const BACKGROUND_COLOR = "color";

export const AUTH = "auth";
export const ONBOARDING = "onboarding";
export const DASHBOARD = "dashboard";

export const TEXT = "text";
export const TEXTAREA = "textarea";
export const RADIO = "radio";
export const CHECKBOX = "checkbox";
export const DATE = "date";
export const TIME = "time";
export const ESIGN = "esign";
export const SELECT = "select";
export const FULL = "full";
export const HALF = "half";
export const NO_CHANGES = "No Changes";
export const CHANGES = "changes";

export const DEFAULT_HOURS = "7";
export const QUICK_HOURS = [6, 7, 8, 9, 10, 11] as const;

export const MAX_SIZE = 50 * 1024;
export const MAX_FILE_SIZE = 10;
export const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
export const DEFAULT_ALLOWED_TYPES = "image/png, image/jpeg, image/jpg";

export const DAY_SHIFT = "Day Shift";
export const NIGHT_SHIFT = "Night Shift";

export const GRID_VIEW = "grid";
export const LIST_VIEW = "list";
export const FOLDER = "folder";
export const FILE = "file";
export const ASCENDING = "asc";
export const DESCENDING = "desc";

export const THEME = "theme";
export const SYSTEM = "systemtheme";
export const CUSTOM = "custom";

export const MAX_AOR = 6;

export const ALL = "all";
export const MY = "my";
export const IMPORTANT = "imp";

export const CSV = "csv";
export const EXCEL = "xlsx";

export const DEFAULT_SORT_BY = "updatedAt";
export const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc";

export const ABORT_ERROR = "AbortError";

export const REQUEST_TIMEOUT = "Request timeout";

export const MAX_LENGTH = 50;

export const DEFAULT_SHIFT_TITLE = "Simple Shift Report";
export const DEFAULT_SHIFT_DESCRIPTION =
  "A simple shift form template for testing";

export const WeatherImage: Record<WeatherIcon, string> = {
  "01d": "/images/01d.png",
  "01n": "/images/01n.png",
  "02d": "/images/02d.png",
  "02n": "/images/02n.png",
  "03d": "/images/03d.png",
  "03n": "/images/03n.png",
  "04d": "/images/04d.png",
  "04n": "/images/04n.png",
  "09d": "/images/09d.png",
  "09n": "/images/09n.png",
  "10d": "/images/10d.png",
  "10n": "/images/10n.png",
  "11d": "/images/11d.png",
  "11n": "/images/11n.png",
  "13d": "/images/13d.png",
  "13n": "/images/13n.png",
  "50d": "/images/50d.png",
  "50n": "/images/50n.png",
};

export const IMAGE_DIMENSIONS = {
  BACKGROUND_WIDTH_MIN: 1500,
  BACKGROUND_HEIGHT_MIN: 500,
  BACKGROUND_WIDTH_MAX: 1920,
  BACKGROUND_HEIGHT_MAX: 1500,
};

export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export const NotificationTypes = {
  AOR_ENDED_BY_OTHER: "AOR_ENDED_BY_OTHER",
  SYSTEM: "SYSTEM",
  BREAK_PROMPT: "FATIGUE_BREAK_PROMPT",
  TIMER_EVENT: "TIMER_EVENT",
  FATIGUE_UPDATE: "FATIGUE_SCORE_UPDATED",
  HOUR_OF_SERVICE: "HOURS_OF_SERVICE_UPDATED",
} as const;

export const NotificationTitles = {
  AOR_ENDED_BY_OTHER: "AOR Ended by Another User",
  PROFILE: "profile",
} as const;