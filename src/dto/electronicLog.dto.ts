export interface WeatherLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export interface AOR {
  _id: string;
  name: string;
  description: string;
  companyId: string;
  color: string;
  code: string;
  dailyHosLimit: number;
  weeklyHosLimit: number;
  emailDistributionList: string[];
  isActive: boolean;
  weatherLocation: WeatherLocation;
  isLocked: boolean;
  shiftAorId: string;
  shiftId: string;
  isActiveTab: boolean;
}

export interface AssignedAORsData {
  aors: AOR[];
  recentAor: string[];
}

export interface AssignedAORsResponse {
  message: string;
  data: AssignedAORsData;
}

// Sample log entry interface for table data
export interface LogEntry {
  id: string;
  category: string;
  facility: string;
  shortDesc: string;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  actions: string[];
  bookmark: boolean;
  aorId?: string;
}

export interface LogEntriesData {
  entries: LogEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LogEntriesResponse {
  message: string;
  data: LogEntriesData;
}

export interface Category {
  _id: string;
  name: string;
  createdBy: string;
  __v: number;
}

export interface LogEntrySavePayload {
  categoryId: string;
  tags: string;
  description: string;
  facilities: string;
  filename?: string | null;
}

export interface LogEntry {
  userId: string;
  shiftAorId: string;
  facilityIds: string[];
  categoryId: string;
  createdBy: string;
  isImportant: boolean;
  tags: string[];
  description: string;
  fileIds: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface LogEntrySaveResponse {
  message: string;
  data?: LogEntry[];
}

export interface LogEntryDto {
  _id: string;
  userId: string;
  shiftAorId: string;
  facilityIds: { _id: string; name: string }[] | null;
  categoryId: { _id: string; name: string };
  createdBy: { _id: string; username: string };
  isImportant: boolean;
  tags: string[];
  description: string;
  fileUrls: string[];
  createdAt: string;
  updatedAt: string;

  [key: string]: unknown;
}
export interface LogEntriesByAorResponse {
  message: string;
  data: {
    data: LogEntryDto[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface LogEntryUpdatePayload {
  categoryId: string;
  tags: string;
  description: string;
  facilities: string;
  filename?: string | null;
}
