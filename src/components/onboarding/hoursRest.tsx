"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchQualityOfSleep,
  fetchCompanies,
  setSelectedHours,
  setSelectedRating,
} from "@/src/store/slices/onboardingSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import {
  DEFAULT_HOURS,
  navigationUrls,
  QUICK_HOURS,
} from "@/src/utils/constant";
import { hoursRestStyles, styles } from "@/src/styles/onboarding.styles";
import WelcomePage from "./invitePage";
import LoadingSpinner from "@/src/components/common/loader";

export default function HoursRestPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const {
    qualityOfSleep,
    shiftAssignment,
    companies,
    loading,
    error,
    companiesFetched,
  } = useAppSelector((state) => state.onboarding);

  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [selectedQualityId, setSelectedQualityId] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);



  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      dispatch(fetchQualityOfSleep());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    if (shiftAssignment) {
      const { continuousRestHours, ratingId } = shiftAssignment;
      if (continuousRestHours && continuousRestHours > 0) {
        setHours(continuousRestHours.toString());
      } else {
        setHours(DEFAULT_HOURS);
      }
      if (ratingId) {
        setSelectedQualityId(ratingId);
      } else {
        setSelectedQualityId("");
      }
    }
  }, [shiftAssignment]);

  const handleHoursChange = useCallback(
    (value: string) => {
      setHours(value);
      dispatch(setSelectedHours(parseFloat(value)));
    },
    [dispatch],
  );

  const handleQualityChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const id = event.target.value;
      setSelectedQualityId(id);
      dispatch(setSelectedRating(id));
    },
    [dispatch],
  );

  const handleContinueClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const parsedHours = parseFloat(hours);

      if (!hours || isNaN(parsedHours) || parsedHours <= 0) {
        return dispatch(
          showAlert({
            message: t("restHours.selectHoursError"),
            type: AlertType.Error,
          }),
        );
      }

      if (!selectedQualityId) {
        return dispatch(
          showAlert({
            message: t("restHours.selectQualityError"),
            type: AlertType.Error,
          }),
        );
      }

      dispatch(setSelectedHours(parsedHours));
      dispatch(setSelectedRating(selectedQualityId));
      setIsRedirecting(true);
      router.push(navigationUrls.onboardingAreaResponse);
    },
    [dispatch, hours, selectedQualityId, router, t],
  );

  const displayRating = useMemo(
    () => qualityOfSleep.findIndex((q) => q._id === selectedQualityId) + 1,
    [qualityOfSleep, selectedQualityId],
  );


  if (loading || !companiesFetched) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return <WelcomePage />;
  }

  return (
    <Container maxWidth="sm" sx={styles.cardContainer}>
      <Typography variant="h5" sx={styles.title}>
        {t("restHours.title")}
      </Typography>
      <Typography sx={styles.subtitle}>{t("restHours.subtitle")}</Typography>

      <Box sx={hoursRestStyles.inputRow}>
        <TextField
          type="number"
          value={hours}
          onChange={(e) => {
            const val = e.target.value;
            const num = parseFloat(val);
            if (val === "") return handleHoursChange("");
            if (!isNaN(num)) {
              const bounded = Math.min(Math.max(num, 0), 24);
              handleHoursChange(bounded.toString());
            }
          }}
          label={t("restHours.hoursLabel")}
          fullWidth
          variant="standard"
          margin="normal"
          disabled={isRedirecting}
          sx={{
            ...hoursRestStyles.inputField,
            ...(isRedirecting ? { pointerEvents: "none" } : {}),
            "& input[type=number]": {
              MozAppearance: "textfield",
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
          }}
          inputProps={{
            min: 0,
            max: 24,
            step: 0.1,
            pattern: "[0-9]*",
          }}
        />
      </Box>

      {/* Quick Select Buttons */}
      <Box sx={hoursRestStyles.quickSelectRow}>
        {QUICK_HOURS.map((h) => {
          const value = h;
          const isActive = parseFloat(hours) === value;
          return (
            <Button
              key={h}
              variant="outlined"
              disabled={isRedirecting}
              sx={{
                ...(isActive
                  ? hoursRestStyles.quickSelectBtnActive
                  : hoursRestStyles.quickSelectBtn),
                ...(isRedirecting ? { pointerEvents: "none" } : {}),
              }}
              onClick={() => handleHoursChange(value.toString())}
            >
              {h} hrs
            </Button>
          );
        })}
      </Box>

      {/* Quality Select */}
      <Box sx={hoursRestStyles.selectContainer}>
        <Box sx={hoursRestStyles.selectRow}>
          <Typography sx={hoursRestStyles.selectLabel}>
            {t("restHours.qualitySleep")}
          </Typography>
          <Select
            value={selectedQualityId}
            onChange={handleQualityChange}
            variant="standard"
            displayEmpty
            disabled={isRedirecting}
            sx={{
              ...hoursRestStyles.select,
              ...(isRedirecting ? { pointerEvents: "none" } : {}),
            }}
            MenuProps={{
              PaperProps: { sx: hoursRestStyles.dropdownMenuPaper },
            }}
          >
            <MenuItem value="" disabled>
              <Typography
                sx={{ ...hoursRestStyles.hoursDescription, textAlign: "left" }}
              >
                {t("restHours.Select")}
              </Typography>
            </MenuItem>
            {qualityOfSleep.map((q) => (
              <MenuItem key={q._id} value={q._id} sx={{ fontSize: "0.85rem" }}>
                <Box sx={hoursRestStyles.Dropdowncard}>
                  <Typography sx={hoursRestStyles.hoursLabel}>
                    {q.rating}
                  </Typography>
                  <Typography sx={hoursRestStyles.hoursDescription}>
                    | {q.quality}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Star Rating */}
      <Box sx={hoursRestStyles.starRow}>
        {[1, 2, 3, 4, 5].map((star) =>
          star <= displayRating ? (
            <StarIcon key={star} sx={{ color: "#FFC107", fontSize: 36 }} />
          ) : (
            <StarBorderIcon
              key={star}
              sx={{ color: "#ccc8c8", fontSize: 36 }}
            />
          ),
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={styles.buttonContainer}>
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={styles.submitButton}
          onClick={handleContinueClick}
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <Typography sx={styles.submitButtonText}>
              {t("restHours.save")}
            </Typography>
          )}
        </Button>
      </Box>
    </Container>
  );
}
