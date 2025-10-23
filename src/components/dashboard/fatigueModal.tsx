"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import DynamicModal from "@/src/components/common/modal";
import { fatigueStyles } from "@/src/styles/dashboardUi.styles";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getActiveShiftMitigations,
  getRecentShifts,
  fetchCurrentShiftScore,
} from "@/src/store/slices/fatigueSlice";
import LoadingSpinner from "../common/loader";
import { formatDate, formatDateAlone } from "@/src/utils/config";
import { useTranslation } from "@/src/hooks/useTranslation";

interface FatigueModalProps {
  open: boolean;
  onClose: () => void;
}

const FatigueModal: React.FC<FatigueModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    activeShiftMitigations,
    activeLoading,
    recentShifts,
    recentLoading,
    recentError,
    currentShiftScore,
  } = useAppSelector((state) => state.fatigue);

  useEffect(() => {
    if (open) {
      dispatch(getActiveShiftMitigations());
      dispatch(getRecentShifts());
      dispatch(fetchCurrentShiftScore());
    }
  }, [open, dispatch]);

  const mitigations = activeShiftMitigations?.mitigations ?? [];

  const totalPoints = activeShiftMitigations?.totalMitigationPoints ?? 0;

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const shift = recentShifts?.slice().reverse()[index] ?? null;
    return {
      day: `Day ${index + 1}`,
      value: shift?.fatigue?.postShiftScore ?? 0,
      color: shift?.fatigueInterpretation?.color ?? "#3D96E1",
      hitchDay: shift?.hitchDay?.day ?? "-",
      date: formatDateAlone(shift?.shiftStartTime),
    };
  });

  const mappedShifts = recentShifts?.map((shift) => {
    return {
      date: formatDate(shift.shiftStartTime),
      hitchDay: shift.hitchDay?.day ?? "-",
      sleep: `${shift.continuousRestHours} Hrs`,
      quality: shift.rating?.credit?.toString() ?? "-",
      sleepCredit: shift.rating?.credit ? `${shift.rating.credit}` : "-",
      mitigation: shift.fatigue?.totalMitigationPoints
        ? `${shift.fatigue.totalMitigationPoints}`
        : "-",
      degradation: shift.fatigue?.currentScore
        ? `-${(100 - shift.fatigue.currentScore).toFixed(1)}`
        : "-", // Degradation
      finalScore: shift.fatigue?.postShiftScore ?? "-",
      status: shift.fatigueInterpretation?.riskLevel ?? "-",
      color: shift.fatigueInterpretation?.color ?? "#3D96E1",
    };
  });

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      width={1000}
      showCloseIcon={true}
      showMicIcon={false}
    >
      <Box sx={fatigueStyles.mainContainer}>
        <Box sx={fatigueStyles.leftColumn}>
          <Box
            sx={{
              ...fatigueStyles.glassStyle,
              ...fatigueStyles.fatigueAssessmentCard,
            }}
          >
            <Box sx={fatigueStyles.cardContent}>
              <Box sx={fatigueStyles.leftCard}>
                <Typography sx={fatigueStyles.titles}>
                  {t("dashboard.fatigueAssessment")}
                </Typography>
                <Typography sx={fatigueStyles.subTitle}>
                  {t("dashboard.subtitle")}
                </Typography>

                

                <Box sx={fatigueStyles.chartContainer}>
                  {chartData.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        ...fatigueStyles.chartBarContainer,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={fatigueStyles.chartValueLabel}>
                        {item.value.toFixed(1)}
                      </Typography>

                      <Box
                        sx={{
                          ...fatigueStyles.chartBar,
                          width: "20px", // fixed width
                          height: `${item.value}px`, // scale it as needed
                          // backgroundColor: item.color ?? "#3D96E1",
                          backgroundColor: "#3D96E1",
                          borderRadius: "4px",
                          transition: "height 0.3s ease",
                        }}
                        title={`Hitch Day: ${item.hitchDay}`}
                      />

                      {/* Day label */}
                      <Typography sx={fatigueStyles.chartLabelBase}>
                        {item.date}
                      </Typography>
                    </Box>
                  ))}
                </Box>

             
              </Box>

              <Box sx={fatigueStyles.rightSideContainer}>
                <Box sx={fatigueStyles.statsGrid}>
                  <Box sx={fatigueStyles.statItem}>
                    <Typography sx={fatigueStyles.statLabel}>
                      {t("dashboard.sleep")}
                    </Typography>
                    <Typography sx={fatigueStyles.statValue}>
                      {currentShiftScore?.continuousRestHours
                        ? `${currentShiftScore.continuousRestHours} Hrs`
                        : "-"}
                    </Typography>
                  </Box>
                  <Box sx={fatigueStyles.statItem}>
                    <Typography sx={fatigueStyles.statLabel}>
                      {t("dashboard.sleepQuality")}
                    </Typography>
                    <Typography sx={fatigueStyles.statValue}>
                      {currentShiftScore?.rating?.credit ?? "-"}
                    </Typography>
                  </Box>
                  <Box sx={fatigueStyles.statItem}>
                    <Typography sx={fatigueStyles.statLabel}>
                      {t("dashboard.hitchDay")}
                    </Typography>
                    <Box sx={fatigueStyles.hitchDayBadge}>
                      <Typography sx={fatigueStyles.hitchDayText}>
                        {currentShiftScore?.hitchDay?.day ?? "-"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={fatigueStyles.statItem}>
                    <Typography sx={fatigueStyles.statLabel}>
                      {t("dashboard.finalScore")}
                    </Typography>
                    <Typography sx={fatigueStyles.statValue}>
                      {currentShiftScore?.fatigue?.currentScore?.toFixed(1) ??
                        "-"}
                    </Typography>
                  </Box>
                </Box>

                

                <Box sx={fatigueStyles.circularProgress}>
                  <svg width="80" height="80" viewBox="0 0 120 120">
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
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={
                        currentShiftScore?.fatigueInterpretation?.color ??
                        "#FF8C00"
                      }
                      strokeWidth="20"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        50 *
                        (1 -
                          (currentShiftScore?.fatigue?.currentScore ?? 0) / 100)
                      }
                      strokeLinecap="round"
                      fill="transparent"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>

                  <Typography sx={fatigueStyles.currentTime}>
                    {currentShiftScore?.fatigue?.currentScore?.toFixed(1) ??
                      "-"}
                  </Typography>
                </Box>

                <Button
                  sx={{
                    ...fatigueStyles.monitorButton,
                    backgroundColor:
                      currentShiftScore?.fatigueInterpretation?.color ??
                      "#FF8C00",
                  }}
                >
                  {currentShiftScore?.fatigueInterpretation?.riskLevel ??
                    "Monitor"}
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              ...fatigueStyles.glassStyle,
              ...fatigueStyles.recentShiftsContainer,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={fatigueStyles.recentShiftsTitle}>
              {t("dashboard.recentShifts")}
            </Typography>

            <Box sx={fatigueStyles.tableHeaderContainer}>
              {[
                "date",
                "hitchDay",
                "sleep",
                "sleepQuality",
                "mitigation",
                "finalScore",
                "status",
              ].map((key) => (
                <Typography key={key} sx={fatigueStyles.tableHeaderText}>
                  {t(`dashboard.tableHeaders.${key}`)}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "4px",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
              }}
            >
              {recentLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <LoadingSpinner size={40} />
                </Box>
              ) : recentError ? (
                <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
                  {recentError}
                </Typography>
              ) : mappedShifts?.length ? (
                mappedShifts.map((shift, index) => (
                  <Box key={index} sx={fatigueStyles.tableRowContainer}>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.date}
                    </Typography>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.hitchDay}
                    </Typography>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.sleep}
                    </Typography>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.sleepCredit}
                    </Typography>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.mitigation}
                    </Typography>
                    <Typography sx={fatigueStyles.tableCellText}>
                      {shift.finalScore}
                    </Typography>
                    <Box
                      sx={{
                        ...fatigueStyles.statusBadgeComplete,
                        backgroundColor: shift.color,
                      }}
                    >
                      <Typography sx={fatigueStyles.statusBadgeText}>
                        {shift.status}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.6)",
                    mt: 2,
                  }}
                >
                  {t("dashboard.noRecentShifts")}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ ...fatigueStyles.rightColumn, ...fatigueStyles.glassStyle }}>
          <Box
            sx={{
              ...fatigueStyles.mitigationHeaderContainer,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={fatigueStyles.mitigationTitle}>
              {t("dashboard.shiftCountermeasures")}
            </Typography>
            <Typography
              sx={{
                ...fatigueStyles.mitigationTitle,
                fontSize: "0.8rem",
                color: "#FF8C00",
              }}
            >
              {t("dashboard.totalPoints")}: {totalPoints}
            </Typography>
          </Box>

          <Box sx={fatigueStyles.mitigationTableHeader}>
            <Typography sx={fatigueStyles.mitigationTableHeaderText}>
              {t("dashboard.onShiftMitigation")}
            </Typography>
            <Typography sx={fatigueStyles.mitigationTableHeaderText}>
              {t("dashboard.credits")}
            </Typography>
          </Box>

          {activeLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <LoadingSpinner size={40} />
            </Box>
          ) : mitigations.length > 0 ? (
            <Box sx={fatigueStyles.mitigationTableContent}>
              {mitigations.map((item) => (
                <Box key={item._id} sx={fatigueStyles.mitigationItemContainer}>
                  <Typography sx={fatigueStyles.mitigationItemTitle}>
                    {item.type === "TIMER" ? `${item.name} mins` : item.name}
                  </Typography>
                  <Typography sx={fatigueStyles.mitigationItemCredits}>
                    {item.credit}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.6)",
                mt: 2,
              }}
            >
              {t("dashboard.noMitigation")}
            </Typography>
          )}
        </Box>
      </Box>
    </DynamicModal>
  );
};

export default FatigueModal;
