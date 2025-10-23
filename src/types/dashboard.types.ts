export interface WeatherByAorItem {
  weatherdata: {
    name: string;
    state?: string;
    tempC?: number;
    tempF?: number;
    day?: string;
    sys?: { country?: string };
    weather?: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  };
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftTimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ShiftTimeByAorItem {
  shiftAorId: string;
  shiftId: string;
  startTime: string;
  endTime: string;
  remaining: ShiftTimeRemaining;
}


export interface WorkStatsDataV2 {
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  currentWeekDay: number;
  currentMonthDay: number;
  weekData: { date: string; hours: number }[];
  monthData: { date: string; hours: number }[];
  dailyTarget: number;
  weeklyTarget: number;
  monthlyTarget: number;
}