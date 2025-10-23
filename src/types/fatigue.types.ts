export enum FatigueMitigationType {
  TIMER = "TIMER",
  COUNTERMEASURE = "COUNTERMEASURE",
}

export interface FatigueMitigationDto {
  _id: string;
  name: string;
  credit: number;
  type?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface FetchFatigueMitigationResponseDto {
  message: string;
  data: FatigueMitigationDto[];
}

export interface ApplyMitigationRequestDto {
  mitigationIds: string[];
}

export interface ApplyMitigationResponseDto {
  message: string;
  data: {
    preShiftScore: number;
    currentScore: number;
    mitigations: {
      mitigationId: string;
      appliedAt: string;
      points: number;
      type: string;
      durationMinutes?: number;
      status?: string;
      startedAt?: string;
      stoppedAt?: string;
      _id: string;
    }[];
    totalMitigationPoints: number;
  };
}

export interface FatigueScoreResponse {
  preShiftScore: number;
  currentScore: number;
  totalMitigationPoints: number;
}

export interface ActiveShiftMitigation {
  _id: string;
  mitigationId: string;
  name: string;
  points: number;
  appliedAt: string;
  type: "TIMER" | "COUNTERMEASURE";
  durationMinutes?: number;
  status?: "ACTIVE" | "COMPLETED";
  startedAt?: string;
  stoppedAt?: string;
  credit: number;
}

export interface ActiveShiftMitigationsResponse {
  shiftId: string;
  preShiftScore: number;
  currentScore: number;
  postShiftScore: number;
  totalMitigationPoints: number;
  mitigations: ActiveShiftMitigation[];
}

export interface ActiveShiftMitigationsApiResponse {
  message: string;
  data: ActiveShiftMitigationsResponse;
}

export interface StopTimerResponse {
  message: string;
  data: {
    preShiftScore: number;
    currentScore: number;
    mitigations: ActiveShiftMitigation[];
    totalMitigationPoints: number;
  };
}

export interface Operator {
  _id: string;
  username: string;
  email: string;
}

export interface HitchDay {
  _id: string;
  day: string;
  credit: number;
}

export interface Mitigation {
  mitigationId: string;
  appliedAt: string;
  points: number;
  type: string;
  durationMinutes?: number;
  status?: string;
  startedAt?: string;
  stoppedAt?: string;
  _id: string;
}

export interface Fatigue {
  _id: string;
  preShiftScore: number;
  currentScore: number;
  postShiftScore: number;
  totalMitigationPoints: number;
  mitigations: Mitigation[];
}

export interface FatigueInterpretation {
  _id: string;
  minScore: number;
  maxScore: number;
  riskLevel: string;
  action: string;
  color: string;
}

export interface Rating {
  _id: string;
  quality: string;
  rating: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AorInfo {
  _id: string;
  name: string;
}

export interface Shift {
  _id: string;
  shiftStartTime: string;
  shiftEndTime?: string;
  continuousRestHours: number;
  hitchDayOffsetId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  operator: Operator;
  rating?: Rating;
  hitchDay: HitchDay;
  fatigue: Fatigue;
  fatigueInterpretation: FatigueInterpretation;
}

export interface RecentShiftsResponse {
  message: string;
  data: Shift[];
}

export interface CurrentShiftFatigueScore {
  _id: string;
  shiftStartTime: string;
  continuousRestHours: number;
  hitchDayOffsetId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  operator: Operator;
  rating: Rating;
  hitchDay: HitchDay;
  fatigue: Fatigue;
  fatigueInterpretation: FatigueInterpretation;
}

export interface StartTimerRequestDto {
  aorId: string;
  timer: string;
  name: string;
}

export interface TimerData {
  _id: string;
  aorId: string;
  userId: string;
  name: string;
  timer: string;
  status: string;
  startTime: string;
  pausedAt: string | null;
  resumedAt: string | null;
  stoppedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StartTimerResponseDto {
  message: string;
  data: TimerData;
}

export interface TimerDataa {
  _id: string;
  aorId: string;
  aorName: string;
  userId: string;
  name: string;
  timer: string;
  status: string;
  startTime: string;
  pausedAt: string | null;
  resumedAt: string | null;
  stoppedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  canControl: boolean;
  elapsedSeconds?: number;
  elapsedTime?: string;
}

export interface TimerViewResponseDto {
  message: string;
  data: TimerDataa[];
}

export interface RecentActivityFacility {
  _id: string;
  name: string;
}

export interface RecentActivityCategory {
  _id: string;
  name: string;
}

export interface RecentActivityCreatedBy {
  _id: string;
  username: string;
}

export interface RecentActivityItem {
  _id: string;
  userId: string;
  shiftAorId: string;
  facilityIds: RecentActivityFacility[];
  categoryId: RecentActivityCategory;
  createdBy: RecentActivityCreatedBy;
  isImportant: boolean;
  tags: string[];
  description: string;
  fileIds: string[];
  __v: number;
  createdAt: string;
  updatedAt: string;
  createdByInfo?: RecentActivityCreatedBy;
  categoryInfo?: RecentActivityCategory;
  facilityInfo?: RecentActivityFacility[];
  primaryFacilityName?: string;
  createdAtFormatted?: string;
  fileUrls?: string[];
  aorInfo: AorInfo;
}

export interface RecentActivityResponse {
  message: string;
  data: RecentActivityItem[];
}
