import React, { useMemo } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import { useTheme } from "@mui/material/styles";
import { dashboardHeaderStyles } from "@/src/styles/dashboard.styles";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";
import { imageUrls, WeatherImage } from "@/src/utils/constant";
import {
  AlertType,
  DashboardHeaderProps,
  WeatherIcon,
} from "@/src/types/types";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";
import {
  getWeatherByAor,
  getShiftTimeByAor,
  getWorkStats,
} from "@/src/store/slices/dashboardSlice";
import { ShiftTimeRemaining } from "@/src/types/dashboard.types";
import { CloudOutlined } from "@mui/icons-material";
import { useSpeechRecognition } from "@/src/hooks/useSpeech";
import RecordingWaves from "@/src/components/common/recordingWaves";
import { getUserNotifications } from "@/src/store/slices/notificationSlice";
import { showAlert } from "@/src/store/slices/alertSlice";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenBgPicker,
}) => {
  const theme = useTheme();
  const styles = dashboardHeaderStyles(theme);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { selectedAOR } = useAppSelector((state) => state.electronicLog);
  const [remainingTime, setRemainingTime] =
    React.useState<ShiftTimeRemaining | null>(null);
  const { t } = useTranslation();
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  const userName = user?.username ? capitalize(user.username) : "User";
  const weather = useAppSelector(
    (state) => state.dashboard.weather?.[0]?.weatherdata,
  );
  const weatherLoading = useAppSelector(
    (state) => state.dashboard.weatherLoading,
  );
  const icon = weather?.weather?.[0]?.icon as WeatherIcon | undefined;
  const src = icon ? WeatherImage[icon] : "/images/default.png";
  const { recording, showWaveBox, handleMicHoldStart, handleMicHoldEnd } =
    useSpeechRecognition();
  const { stoppedAor } = useAppSelector((state) => state.shiftChange);
  const shiftTime = useAppSelector((state) => state.dashboard.shiftTime);
  const workStats = useAppSelector((state) => state.dashboard.workStats);
  const greetingKey = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "dashboardHeader.morning";
    if (hour < 18) return "dashboardHeader.afternoon";
    return "dashboardHeader.evening";
  }, []);
  const { selectedRole } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (selectedAOR) {
      dispatch(getWeatherByAor(selectedAOR));
    }
  }, [selectedAOR, dispatch]);

  React.useEffect(() => {
    dispatch(getShiftTimeByAor());
    dispatch(getWorkStats());
    dispatch(getUserNotifications({ page: 1 }));
  }, [dispatch, stoppedAor]);

  React.useEffect(() => {
    if (shiftTime?.remaining) {
      setRemainingTime(shiftTime.remaining);
    }
  }, [shiftTime]);



  React.useEffect(() => {
    if (!shiftTime) {
      setRemainingTime(null);
    }
  }, [shiftTime]);

  React.useEffect(() => {
    if (!remainingTime) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (!prev) return null;

        let { hours, minutes, seconds } = prev;
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
  }, [remainingTime, dispatch]);

  const formatRemainingTime = (time?: ShiftTimeRemaining | null) => {
    if (!time) return "--:--:--";
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  const formatHours = (worked?: number, limit?: number) => {
    if (worked == null || limit == null) return "--/--Hr";
    return `${worked.toFixed(1)}/${limit}Hr`;
  };

  const activeControllerName = useMemo(() => {
    if (typeof window === "undefined") return "";
    const name = localStorage.getItem("activeControllerName");
    return name ? capitalize(name) : "";
  }, []);

  const combinedGreetingName = activeControllerName
    ? `${userName} (${activeControllerName})`
    : userName;

  return (
    <Box sx={styles.root}>
      <Box sx={styles.headerRow}>
        <Typography sx={styles.greeting}>
          {t(greetingKey, { userName: combinedGreetingName })}
        </Typography>

        <Box sx={styles.headerRightRow}>
        
        
          <RBAC allowedRoles={[UserRole.ActiveController, UserRole.Observer]}>
            {weatherLoading ? (
              <Box sx={{ fontSize: "0.8rem" }}>
                <Typography
                  sx={{
                    color: "#3D96E1",
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    opacity: 0.7,
                    fontWeight: "bold",
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            ) : weather ? (
              <Box sx={{ fontSize: "0.8rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    color: "#3D96E1",
                    alignItems: "center",
                    gap: 1,
                    padding: "4px 8px",
                    fontWeight: "bold",
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "#3D96E1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {weather.weather?.[0]?.icon ? (
                      <Box
                        component="img"
                        src={src}
                        alt={weather.weather[0].description || "weather"}
                        sx={{
                          width: 24,
                          height: 24,
                        }}
                      />
                    ) : (
                      <CloudOutlined fontSize="small" sx={{ color: "#fff" }} />
                    )}
                  </Box>

                  {/* City + State */}
                  <Typography component="span" sx={{ fontWeight: 500 }}>
                    {weather.name || "-"}
                    {weather.state ? `, ${weather.state}` : ""}
                  </Typography>

                  {/* Temperature */}
                  <Typography component="span" sx={{ opacity: 0.85 }}>
                    {weather.tempC != null || weather.tempF != null
                      ? `${weather.tempC != null ? `${weather.tempC} °C` : "-"} / ${
                          weather.tempF != null ? `${weather.tempF} °F` : "-"
                        }`
                      : "-"}
                  </Typography>

                  {/* Day */}
                  <Typography component="span" sx={{ opacity: 0.85 }}>
                    {weather.day || "-"}
                  </Typography>

                  {/* Country */}
                  <Typography component="span" sx={{ opacity: 0.85 }}>
                    {weather?.sys?.country || "-"}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ fontSize: "0.8rem" }}>
                <Typography
                  sx={{
                    color: "#3D96E1",
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    opacity: 0.7,
                    fontWeight: "bold",
                  }}
                >
                  {t("dashboardHeader.noWeather")}
                </Typography>
              </Box>
            )}
          </RBAC>
       
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {showWaveBox && (
              <Box sx={styles.recordWaves}>
                <RecordingWaves />
              </Box>
            )}
          
            <Image
              src={imageUrls.microphone}
              alt="microphone"
              width={42}
              height={42}
              style={{ cursor: "pointer", zIndex: 3 }}
              onMouseDown={handleMicHoldStart}
              onMouseUp={handleMicHoldEnd}
              onMouseLeave={recording ? handleMicHoldEnd : undefined}
              onTouchStart={handleMicHoldStart}
              onTouchEnd={handleMicHoldEnd}
            />
           
          </Box>
         
          <Avatar
            src={user?.profileUrl || ""}
            alt={userName}
            sx={styles.avatar}
          >
            {!user?.profileUrl && userName?.[0]}
          </Avatar>

          <RBAC allowedRoles={[UserRole.Administrator]}>
            <Box sx={styles.bgContianer} onClick={onOpenBgPicker}>
              <Image
                src={imageUrls.bg}
                alt="bg"
                width={28}
                height={28}
                style={{ display: "block" }}
              />
            </Box>
          </RBAC>
        </Box>
      </Box>
      <RBAC allowedRoles={[UserRole.ActiveController, UserRole.Observer]}>
        <Box sx={styles.infoWeatherRow}>
          <Box sx={styles.infoRow}>
            <Box sx={styles.infoBox}>
              <AccessTimeIcon fontSize="small" />
              {t("dashboardHeader.timeRemaining")}
              <b
                style={{
                  display: "inline-block",
                  width: "65px",
                  textAlign: "center",
                }}
              >
                {formatRemainingTime(remainingTime)}
              </b>
            </Box>

           
            <Box sx={styles.infoBox}>
              <EventIcon fontSize="small" />
              {t("dashboardHeader.daily")}{" "}
              <b>
                {formatHours(workStats?.dailyHours, workStats?.dailyTarget)}
              </b>
            </Box>

            <Box sx={styles.infoBox}>
              <EventIcon fontSize="small" />
              {t("dashboardHeader.weekly")}{" "}
              <b>
                {formatHours(workStats?.weeklyHours, workStats?.weeklyTarget)}
              </b>
            </Box>
          </Box>
          <RBAC allowedRoles={[UserRole.ActiveController]}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box sx={styles.bgContianer} onClick={onOpenBgPicker}>
                <Image
                  src={imageUrls.bg}
                  alt="bg"
                  width={28}
                  height={28}
                  style={{ display: "block" }}
                />
              </Box>
            </Box>
          </RBAC>
        </Box>
      </RBAC>


    </Box>
  );
};

export default DashboardHeader;
