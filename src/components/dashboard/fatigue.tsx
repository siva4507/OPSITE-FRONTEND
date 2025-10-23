"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getActiveShiftMitigations,
  stopTimerAction,
  fetchCurrentShiftScore,
  fetchRecentActivityAction,
} from "@/src/store/slices/fatigueSlice";
import { fatigueStyles } from "@/src/styles/dashboardUi.styles";
import FatigueModal from "./fatigueModal";
import DurationSampleModal from "./breakModal";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { useTranslation } from "@/src/hooks/useTranslation";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";

const Fatigue: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { activeShiftMitigations, currentShiftScore } = useAppSelector(
    (state) => state.fatigue,
  );
  const { activeShifts } = useAppSelector((state) => state.shiftChange);
  const [modalOpen, setModalOpen] = useState(false);
  const [breakmodalOpen, setBreakModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCalledStopRef = useRef(false);

  useEffect(() => {
    dispatch(getActiveShiftMitigations());
    dispatch(fetchCurrentShiftScore());
  }, []);

  const activeMitigation = activeShiftMitigations?.mitigations?.find(
    (m) => m.type === "TIMER" && m.status === "ACTIVE",
  );

  useEffect(() => {
    hasCalledStopRef.current = false;

    const calculateTimeLeft = () => {
      if (
        !activeMitigation ||
        !activeMitigation.startedAt ||
        !activeMitigation.durationMinutes
      ) {
        return 0;
      }

      const startTime = new Date(activeMitigation.startedAt).getTime();
      const durationMs = activeMitigation.durationMinutes * 60 * 1000;
      const endTime = startTime + durationMs;
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      return remaining;
    };

    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    if (initialTime === 0 && activeMitigation && !hasCalledStopRef.current) {
      hasCalledStopRef.current = true;
      handleAutoStop(activeMitigation._id);
    }
    if (activeMitigation && initialTime > 0) {
      timerRef.current = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);

        if (remaining <= 0 && timerRef.current) {
          clearInterval(timerRef.current);
          if (!hasCalledStopRef.current) {
            hasCalledStopRef.current = true;
            handleAutoStop(activeMitigation._id);
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMitigation]);

  const getTimeAgo = (appliedAt: string | undefined) => {
    if (!appliedAt) return "-";

    const now = Date.now();
    const appliedTime = new Date(appliedAt).getTime();
    let diffSeconds = Math.max(0, Math.floor((now - appliedTime) / 1000));

    const hrs = Math.floor(diffSeconds / 3600);
    diffSeconds %= 3600;
    const mins = Math.floor(diffSeconds / 60);

    return `${hrs}h ${mins}m ${t("dashboard.ago")}`;
  };
  const lastAppliedMitigation =
    currentShiftScore?.fatigue?.mitigations?.reduce(
      (latest, m) => {
        if (!latest) return m;
        return new Date(m.appliedAt) > new Date(latest.appliedAt) ? m : latest;
      },
      null as (typeof currentShiftScore.fatigue.mitigations)[0] | null,
    ) ?? null;

  const lastBreakTimeAgo = getTimeAgo(lastAppliedMitigation?.appliedAt);

  const handleAutoStop = async (mitigationId: string) => {
    try {
      await dispatch(stopTimerAction(mitigationId)).unwrap();
      await dispatch(getActiveShiftMitigations()).unwrap();
    } catch (error) {
      console.error("Failed to auto-stop timer:", error);
    }
  };

  const handleStopBreak = async () => {
    if (!activeMitigation?._id) return;

    try {
      await dispatch(stopTimerAction(activeMitigation._id)).unwrap();
      await dispatch(getActiveShiftMitigations()).unwrap();
      dispatch(fetchRecentActivityAction());
    } catch (error) {
      console.error("Failed to stop timer:", error);
    }

    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleModalSubmit = async (data: Record<string, unknown>) => {
    console.log("Break Data Submitted:", data);
    try {
      await dispatch(getActiveShiftMitigations()).unwrap();
      dispatch(fetchCurrentShiftScore());
      dispatch(fetchRecentActivityAction());
    } catch (error) {
      console.error("Failed to fetch active mitigations:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={() => setModalOpen(true)}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          <Typography sx={fatigueStyles.title}>
            {t("dashboard.title")}
          </Typography>
          <RBAC allowedRoles={[UserRole.ActiveController]}>
            {currentShiftScore?.status === "Active" && (
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  setBreakModalOpen(true);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#FFF",
                  borderRadius: 2,
                  borderColor: "#FFF",
                  mt: -2,
                  fontSize: "0.6rem",
                  px: 1,
                }}
              >
                {t("dashboard.countermeasures")}{" "}
                <FreeBreakfastOutlinedIcon fontSize="small" />
              </Button>
            )}
          </RBAC>
        </Box>

        <Box sx={fatigueStyles.contentContainer}>
          <Box sx={fatigueStyles.infoRow}>
            <Typography sx={fatigueStyles.label}>
              {t("dashboard.restTaken")}
            </Typography>
            <Typography sx={fatigueStyles.value}>
              {" "}
              {currentShiftScore?.continuousRestHours || 0}{" "}
              {t("dashboard.hours")}
            </Typography>
          </Box>

          <Box sx={fatigueStyles.infoRow}>
            <Typography sx={fatigueStyles.label}>
              {t("dashboard.fatigueScore")}
            </Typography>
            <Typography
              sx={{
                ...fatigueStyles.value,
                fontSize: "1.6rem",
                fontWeight: 600,
                color:
                  currentShiftScore?.fatigueInterpretation?.color ?? "#3D96E1",
              }}
            >
              {currentShiftScore?.fatigue?.currentScore?.toFixed(1) ?? "-"}
            </Typography>
          </Box>

          <Box sx={fatigueStyles.infoRow}>
            <Typography sx={fatigueStyles.label}>
              {t("dashboard.lastBreak")}
            </Typography>
            <Typography
              sx={{
                ...fatigueStyles.value,
                ...fatigueStyles.redText,
                fontSize: "1rem",
              }}
            >
              {lastBreakTimeAgo}
            </Typography>
          </Box>

          {activeMitigation && timeLeft > 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: 2,
                px: 1,
              }}
            >
              <Typography sx={{ color: "#FFF", fontSize: "0.9rem" }}>
                {t("dashboard.activeBreak")}: {formatTime(timeLeft)}
              </Typography>
              <Tooltip title="Stop Break">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStopBreak();
                  }}
                  sx={{ color: "#FF5252" }}
                >
                  <StopCircleOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography
              sx={{
                color: "#BDBDBD",
                fontSize: "0.85rem",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              {t("dashboard.noActiveBreak")}
            </Typography>
          )}
        </Box>
      </Box>

      <FatigueModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <DurationSampleModal
        open={breakmodalOpen}
        onClose={() => setBreakModalOpen(false)}
        onApplied={handleModalSubmit}
      />
    </>
  );
};

export default Fatigue;