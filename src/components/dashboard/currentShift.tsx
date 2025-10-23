"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { shiftStyles } from "@/src/styles/dashboardUi.styles";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import {
  getShiftTimeByAor,
  getWorkStats,
} from "@/src/store/slices/dashboardSlice";
import { ShiftTimeRemaining } from "@/src/types/dashboard.types";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { UserRole } from "@/src/types/auth.types";
import { useTranslation } from "@/src/hooks/useTranslation";

interface CurrentShiftProps {
  startTime?: string;
  expectedEndTime?: string;
  active?: boolean;
  currentTime?: string;
  dailyHours?: number;
  dailyLimit?: number;
  weeklyHours?: number;
  weeklyLimit?: number;
  monthlyHours?: number;
  monthlyLimit?: number;
}

const CurrentShift: React.FC<CurrentShiftProps> = ({ active = true }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [remainingTime, setRemainingTime] = useState<ShiftTimeRemaining | null>(
    null,
  );

  const shiftTime = useAppSelector((state) => state.dashboard.shiftTime);
  const workStats = useAppSelector((state) => state.dashboard.workStats);
  const { stoppedAor } = useAppSelector((state) => state.shiftChange);

  const { selectedRole } = useAppSelector((state) => state.auth);

  // Fetch shift time and work stats on mount and when dependencies change
  useEffect(() => {
    dispatch(getShiftTimeByAor());
    dispatch(getWorkStats());
  }, [dispatch, stoppedAor]);

  // Update remaining time when shift time changes
  useEffect(() => {
    if (shiftTime?.remaining) {
      setRemainingTime(shiftTime.remaining);
    }
  }, [shiftTime]);

  // Reset remaining time when shift time is null
  useEffect(() => {
    if (!shiftTime) {
      setRemainingTime(null);
    }
  }, [shiftTime]);

  // Countdown timer logic
  useEffect(() => {
    if (!remainingTime) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (!prev) return null;

        let { hours, minutes, seconds } = prev;

        // Check if time is up
        if (hours === 0 && minutes === 0 && seconds === 0) {
          if (selectedRole === UserRole.ActiveController) {
            dispatch(
              showAlert({
                message: t("common.shiftCompleted"),
                type: AlertType.Warning,
              }),
            );
          }
          clearInterval(interval);
          return null;
        }

        // Decrement time
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, dispatch, selectedRole, t]);

  // Format time for display
  const formatRemainingTime = (time?: ShiftTimeRemaining | null) => {
    if (!time) return "--:--:--";
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  // Format time for shift start/end (12-hour format with AM/PM)
  const formatShiftTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/\s/g, ""); // Remove space between time and AM/PM
  };

  // Calculate progress percentage for the circular chart
  const calculateProgress = () => {
    if (!shiftTime?.startTime || !shiftTime?.endTime || !remainingTime)
      return 0;

    const start = new Date(shiftTime.startTime).getTime();
    const end = new Date(shiftTime.endTime).getTime();
    const totalDuration = end - start;

    const remainingMillis =
      (remainingTime.hours * 3600 +
        remainingTime.minutes * 60 +
        remainingTime.seconds) *
      1000;
    const elapsed = totalDuration - remainingMillis;

    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  const getProgressColor = (value: number, limit: number) => {
    if (value > limit) return "#FF6B6B"; // Exceeded
    if (value / limit > 0.75) return "#FFC107"; // Warning
    return "#4CD964"; // Safe
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const dailyHours = workStats?.dailyHours ?? 0;
  const dailyLimit = workStats?.dailyTarget ?? 12;
  const weeklyHours = workStats?.weeklyHours ?? 0;
  const weeklyLimit = workStats?.weeklyTarget ?? 65;
  const monthlyHours = workStats?.monthlyHours ?? 0;
  const monthlyLimit = workStats?.monthlyTarget ?? 240;


  const dailyProgress = (dailyHours / dailyLimit) * 100;
  const weeklyProgress = (weeklyHours / weeklyLimit) * 100;
  const monthlyProgress = (monthlyHours / monthlyLimit) * 100;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ ...shiftStyles.contentContainer, flex: 1 }}>
        <Box sx={shiftStyles.circularContainer}>
          <Typography sx={shiftStyles.title}>
            {t("dashboard.currentShift")}
          </Typography>
          <Box sx={shiftStyles.circularProgress}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="20"
                fill="transparent"
                style={{
                  filter: "blur(-1.5px)",
                  backdropFilter: "blur(50.25px)",
                  boxShadow: `
                    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
                    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
                    0px 0px 20.8px -5.2px #FFFFFF33 inset
                  `,
                }}
              />
              {/* Active Progress */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#3D96E1"
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>

            {/* Centered Countdown Time */}
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#FFFFFF",
                position: "absolute",
                zIndex: 2,
              }}
            >
              {formatRemainingTime(remainingTime)}
            </Typography>
          </Box>
          <Box
            sx={{
              ...shiftStyles.legendItem,
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box
              sx={{
                ...shiftStyles.legendColorBox,
                backgroundColor:
                  active && remainingTime ? "#4CD964" : "#FF6B6B",
              }}
            />
            <Typography
              sx={{
                ...shiftStyles.legendText,
                color: active && remainingTime ? "#4CD964" : "#FF6B6B",
              }}
            >
              {active && remainingTime
                ? t("dashboard.active")
                : t("dashboard.inactive")}
            </Typography>
          </Box>
          <Box sx={shiftStyles.shiftInfo}>
            <Typography sx={shiftStyles.shiftLabel}>
              {t("dashboard.started")}: {formatShiftTime(shiftTime?.startTime)}
            </Typography>
            <Typography sx={shiftStyles.shiftLabel}>
              {t("dashboard.expectedEnd")}:{" "}
              {formatShiftTime(shiftTime?.endTime)}
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Hours of Service */}
        <Box sx={shiftStyles.hoursContainer}>
          <Typography sx={shiftStyles.title}>
            {t("dashboard.hoursOfService")}
          </Typography>

          {/* Daily Hours */}
          <Box sx={shiftStyles.progressItem}>
            <Box sx={shiftStyles.progressHeader}>
              <Typography sx={shiftStyles.progressLabel}>
                {t("dashboard.daily")}
              </Typography>
              <Typography
                sx={{
                  ...shiftStyles.progressValue,
                  color: getProgressColor(dailyHours, dailyLimit),
                }}
              >
                {dailyHours.toFixed(1)}/{dailyLimit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(dailyProgress, 100)}
              sx={{
                ...shiftStyles.progressBar,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getProgressColor(dailyHours, dailyLimit),
                },
              }}
            />
          </Box>

          {/* Weekly Hours */}
          <Box sx={shiftStyles.progressItem}>
            <Box sx={shiftStyles.progressHeader}>
              <Typography sx={shiftStyles.progressLabel}>
                {t("dashboard.weekly")}
              </Typography>
              <Typography
                sx={{
                  ...shiftStyles.progressValue,
                  color: getProgressColor(weeklyHours, weeklyLimit),
                }}
              >
                {weeklyHours.toFixed(1)}/{weeklyLimit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(weeklyProgress, 100)}
              sx={{
                ...shiftStyles.progressBar,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getProgressColor(weeklyHours, weeklyLimit),
                },
              }}
            />
          </Box>

          {/* Monthly Hours */}
          <Box sx={shiftStyles.progressItem}>
            <Box sx={shiftStyles.progressHeader}>
              <Typography sx={shiftStyles.progressLabel}>
                {t("dashboard.monthly")}
              </Typography>
              <Typography
                sx={{
                  ...shiftStyles.progressValue,
                  color: getProgressColor(monthlyHours, monthlyLimit),
                }}
              >
                {monthlyHours.toFixed(1)}/{monthlyLimit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(monthlyProgress, 100)}
              sx={{
                ...shiftStyles.progressBar,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getProgressColor(monthlyHours, monthlyLimit),
                },
              }}
            />
          </Box>

          {/* Bottom Legend */}
          <Box sx={shiftStyles.legendContainer}>
            <Box sx={shiftStyles.legendItem}>
              <Box
                sx={{
                  ...shiftStyles.legendColorBox,
                  backgroundColor: "#4CD964",
                }}
              />
              <Typography sx={{ ...shiftStyles.legendText, color: "#4CD964" }}>
                {t("dashboard.safe")}
              </Typography>
            </Box>

            <Box sx={shiftStyles.legendItem}>
              <Box
                sx={{
                  ...shiftStyles.legendColorBox,
                  backgroundColor: "#FFC107",
                }}
              />
              <Typography sx={{ ...shiftStyles.legendText, color: "#FFC107" }}>
                {t("dashboard.warning")}
              </Typography>
            </Box>

            <Box sx={shiftStyles.legendItem}>
              <Box
                sx={{
                  ...shiftStyles.legendColorBox,
                  backgroundColor: "#FF6B6B",
                }}
              />
              <Typography sx={{ ...shiftStyles.legendText, color: "#FF6B6B" }}>
                {t("dashboard.exceeded")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CurrentShift;
