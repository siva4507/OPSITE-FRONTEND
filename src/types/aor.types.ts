export interface Company {
  _id: string;
  name: string;
}

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  city: CityResponse;
  state: StateResponse;
  zipcode: string;
  timezoneId: TimezoneResponse;
}

export interface Aor {
  _id: string;
  name: string;
  description: string;
  companyId: string;
  company: Company;
  color: string;
  code: string;
  dailyHosLimit: number;
  weeklyHosLimit: number;
  emailDistributionList: string[];
  isActive: boolean;
  Location: WeatherLocation;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface AorResponse {
  data: Aor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AddAorRequest {
  name: string;
  description?: string;
  companyId: string;
  color: string;
  code?: string;
  dailyHosLimit?: number;
  weeklyHosLimit?: number;
  emailDistributionList?: string[];
  isActive: boolean;
  Location: {
    latitude?: number;
    longitude?: number;
    city?: CityResponse | string;
    state?: StateResponse | string;
    zipcode?: string;
    timezoneId?: TimezoneResponse | string;
  };
}

export interface AddAorResponse {
  message: string;
  data: Aor;
}

export interface StateResponse {
  _id: string;
  name: string;
  __v: number;
}

export interface CityResponse {
  _id: string;
  name: string;
  state: string;
  __v: number;
}

export interface TimezoneResponse {
  _id: string;
  label: string;
  tz: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
