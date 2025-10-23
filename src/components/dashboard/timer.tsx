"use client";

import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { imageUrls } from "@/src/utils/constant";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { timerStyles } from "@/src/styles/dashboardUi.styles";
import TimerModal from "./timerModal";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchRecentActivityAction,
  fetchTimersAction,
  pauseTimerAction,
  resumeTimerAction,
  stopTimerByIdAction,
} from "@/src/store/slices/fatigueSlice";
import { TimerData, TimerDataa } from "@/src/types/fatigue.types";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";

const Timer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { timers, timersLoading, currentShiftScore } = useAppSelector(
    (state) => state.fatigue,
  );
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayTimes, setDisplayTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchTimersAction());
  }, [dispatch]);

  const parseTimeToSeconds = (timeString: string): number => {
    const [h, m, s] = timeString.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const refreshTimers = () => {
    dispatch(fetchTimersAction());
  };

  const handlePauseResumeClick = async (timer: TimerData) => {
    try {
      if (timer.status === "RUNNING") {
        await dispatch(pauseTimerAction(timer._id)).unwrap();
      } else if (timer.status === "PAUSED") {
        await dispatch(resumeTimerAction(timer._id)).unwrap();
      }
      refreshTimers();
      dispatch(fetchRecentActivityAction());
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string"
              ? error
              : t(
                  timer.status === "RUNNING"
                    ? "dashboard.pauseError"
                    : "dashboard.resumeError",
                ),
        }),
      );
    }
  };

  const handleStopClick = async (timer: TimerData) => {
    try {
      await dispatch(stopTimerByIdAction(timer._id)).unwrap();
      dispatch(fetchTimersAction());
      dispatch(fetchRecentActivityAction());
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string"
              ? error
              : t("dashboard.fatigue.stopFailed"),
        }),
      );
    }
  };

  // Sync display times with API data when timers update
  useEffect(() => {
    if (timers && timers.length > 0) {
      timers.forEach((t) => {
        const totalDuration = parseTimeToSeconds(t.timer);
        const elapsed = parseTimeToSeconds(t.elapsedTime || "00:00:00");
        const remainingSeconds = Math.max(0, totalDuration - elapsed);

        // Update display time from API
        setDisplayTimes((prev) => ({
          ...prev,
          [t._id]: remainingSeconds,
        }));
      });
    }
  }, [timers]);

  // Countdown for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTimes((prev) => {
        const updated = { ...prev };

        timers?.forEach((t) => {
          if (t.status === "RUNNING") {
            const currentRemaining = prev[t._id];

            if (currentRemaining !== undefined && currentRemaining > 0) {
              updated[t._id] = currentRemaining - 1;
            } else if (currentRemaining === 0) {
              // Timer completed
              if (t.canControl) {
                dispatch(stopTimerByIdAction(t._id))
                  .unwrap()
                  .then(() => {
                    dispatch(fetchTimersAction());
                  });
              }
            }
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, timers]);

  // Filter out stopped timers
  const activeTimers = timers?.filter((t) => t.status !== "STOPPED") || [];
  const currentTimer: TimerDataa | null =
    activeTimers.length > 0
      ? activeTimers[currentIndex % activeTimers.length]
      : null;

  const handleNext = () => {
    if (activeTimers.length > 0)
      setCurrentIndex((prev) => (prev + 1) % activeTimers.length);
  };

  const handlePrev = () => {
    if (activeTimers.length > 0)
      setCurrentIndex(
        (prev) => (prev - 1 + activeTimers.length) % activeTimers.length,
      );
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (timersLoading) {
    return (
      <Box
        sx={{
          ...timerStyles.mainContainer,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ color: "#fff", mb: 2 }} />
      </Box>
    );
  }

  if (!timers || activeTimers.length === 0 || !currentTimer) {
    return (
      <Box
        sx={{
          ...timerStyles.mainContainer,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <AccessAlarmIcon sx={{ fontSize: 60, color: "#FFF", mb: 2 }} />
        <Typography sx={{ color: "#FFF", fontSize: "16px", mb: 2 }}>
          {t("dashboard.startTimer")}
        </Typography>
        <RBAC allowedRoles={[UserRole.ActiveController]}>
          {currentShiftScore?.status === "Active" && (
            <Box
              sx={{
                ...timerStyles.plusIcon,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box onClick={handleAddClick} style={{ cursor: "pointer" }}>
                <Image src={imageUrls.add} alt="Add" width={20} height={20} />
              </Box>
            </Box>
          )}
        </RBAC>
        <TimerModal
          open={isModalOpen}
          onClose={handleModalClose}
          onTimerStarted={() => {
            refreshTimers();
          }}
        />
      </Box>
    );
  }

  const remainingTime = displayTimes[currentTimer._id] ?? 0;

  return (
    <Box sx={timerStyles.mainContainer}>
      {/* Top Row */}
      <Box sx={timerStyles.topRow}>
        <Box sx={timerStyles.iconsColumn}>
          <Box sx={timerStyles.icon}>
            <Image src={imageUrls.alarm} alt="Alarm" width={30} height={30} />
          </Box>
          <RBAC allowedRoles={[UserRole.ActiveController]}>
            {currentTimer && (
              <Box
                sx={{
                  ...timerStyles.icon,
                  cursor: currentTimer.canControl ? "pointer" : "not-allowed",
                  opacity: currentTimer.canControl ? 1 : 0.5,
                }}
                onClick={() =>
                  currentTimer.canControl &&
                  handlePauseResumeClick(currentTimer)
                }
              >
                {currentTimer.status === "PAUSED" ? (
                  <RestartAltIcon sx={{ fontSize: 30, color: "#FFF" }} />
                ) : (
                  <PauseCircleOutlineIcon
                    sx={{ fontSize: 30, color: "#FFF" }}
                  />
                )}
              </Box>
            )}
          </RBAC>
        </Box>

        {/* Timer Display */}
        <Typography sx={timerStyles.timerText}>
          {/* {timersLoading ? "Loading..." : formatTime(remainingTime)} */}
          {formatTime(remainingTime)}
        </Typography>
      </Box>

      {/* Plus + Stop Icons */}
      <RBAC allowedRoles={[UserRole.ActiveController]}>
        <Box
          sx={{
            ...timerStyles.plusIcon,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {currentTimer && (
            <Box
              sx={{
                ...timerStyles.icon,
                cursor: currentTimer.canControl ? "pointer" : "not-allowed",
                opacity: currentTimer.canControl ? 1 : 0.5,
              }}
              onClick={() =>
                currentTimer.canControl && handleStopClick(currentTimer)
              }
            >
              <StopCircleOutlinedIcon
                sx={{ fontSize: 30, color: "#FFF", marginTop: -10 }}
              />
            </Box>
          )}
          {currentShiftScore?.status === "Active" && (
            <Box onClick={handleAddClick} style={{ cursor: "pointer" }}>
              <Image src={imageUrls.add} alt="Add" width={20} height={20} />
            </Box>
          )}
        </Box>
      </RBAC>

      {/* Bottom Section */}
      <Box sx={timerStyles.bottomSection}>
        <Typography sx={timerStyles.bottomTitle}>
          {currentTimer.name}
        </Typography>
        <Typography sx={timerStyles.bottomSubtitle}>
          {t("dashboard.started")}:{" "}
          {new Date(currentTimer.startTime).toLocaleString()}
        </Typography>
        {currentTimer.aorName && (
          <Typography sx={timerStyles.bottomSubtitle}>
            {t("dashboard.aor")}: {currentTimer.aorName}
          </Typography>
        )}
      </Box>

      {/* Right Controls */}
      {activeTimers && activeTimers.length > 1 && (
        <Box sx={timerStyles.rightControls}>
          <Box sx={timerStyles.controlCircle} onClick={handlePrev}>
            <ChevronLeft sx={timerStyles.controlIcon} />
          </Box>
          <Box sx={timerStyles.controlCircle} onClick={handleNext}>
            <ChevronRight sx={timerStyles.controlIcon} />
          </Box>
        </Box>
      )}

      {/* Timer Modal */}
      <TimerModal
        open={isModalOpen}
        onClose={handleModalClose}
        onTimerStarted={() => {
          refreshTimers();
          dispatch(fetchRecentActivityAction());
        }}
      />
    </Box>
  );
};

export default Timer;
