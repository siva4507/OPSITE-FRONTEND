"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import {
  fetchControllerUsers,
  impersonateUserThunk,
} from "@/src/store/slices/onboardingSlice";
import { AlertType } from "@/src/types/types";
import { hoursRestStyles, styles } from "@/src/styles/onboarding.styles";
import { navigationUrls } from "@/src/utils/constant";
import {
  setSelectedRoles,
  setOnboardingCompleted,
} from "@/src/store/slices/authSlice";
import { UserRole } from "@/src/types/auth.types";
import { adminStyles } from "@/src/styles/admin.styles";

export default function ObserverPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const { users, loading } = useAppSelector((state) => state.onboarding);
  const [selectedControllerId, setSelectedControllerId] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    dispatch(fetchControllerUsers());
  }, [dispatch]);

 

  const handleControllerChange = (event: SelectChangeEvent<string>) => {
    setSelectedControllerId(event.target.value);
  };

  const uniqueUsers = Array.from(
    new Map(users.map((u) => [u.username, u])).values(),
  );

  const handleContinueClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!selectedControllerId) {
      dispatch(
        showAlert({
          message: t("activeController.warning"),
          type: AlertType.Warning,
        }),
      );
      return;
    }

    try {
      await dispatch(impersonateUserThunk(selectedControllerId)).unwrap();

      const selectedController = users.find(
        (user) => user._id === selectedControllerId,
      );
      if (selectedController) {
        localStorage.setItem(
          "activeControllerName",
          selectedController.username,
        );
      }

      dispatch(setSelectedRoles(UserRole.Observer));
      dispatch(setOnboardingCompleted(true));

      setIsRedirecting(true);
      setTimeout(() => router.replace(navigationUrls.shiftChange), 3000);
    } catch (err) {
      dispatch(
        showAlert({
          message: String(err),
          type: AlertType.Error,
        }),
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={styles.cardContainer}>
      <Typography variant="h5" sx={styles.title}>
        {t("activeController.title")}
      </Typography>
      <Typography variant="body2" sx={styles.subtitle}>
        {t("activeController.subtitle")}
      </Typography>

      <Box sx={hoursRestStyles.selectContainer}>
        <Box sx={hoursRestStyles.selectRow}>
          {users.length > 5 ? (
            <Autocomplete
              options={uniqueUsers}
              getOptionLabel={(option) => option?.username || ""}
              loading={loading}
              disabled={isRedirecting}
              value={users.find((u) => u._id === selectedControllerId) || null}
              onChange={(_event, newValue) =>
                setSelectedControllerId(newValue ? newValue._id : "")
              }
              filterOptions={(options, { inputValue }) =>
                inputValue
                  ? options.filter((o) =>
                      o.username
                        ?.toLowerCase()
                        .includes(inputValue.toLowerCase()),
                    )
                  : options
              }
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("activeController.select")}
                  variant="standard"
                  sx={hoursRestStyles.autoComplete}
                />
              )}
              noOptionsText={t("common.noOptions")}
              slotProps={{
                listbox: { sx: hoursRestStyles.autocompleteListbox },
                paper: { sx: hoursRestStyles.autocompletePaper },
              }}
            />
          ) : (
            <Select
              value={selectedControllerId}
              onChange={handleControllerChange}
              variant="standard"
              disableUnderline
              displayEmpty
              disabled={isRedirecting}
              sx={{
                ...hoursRestStyles.select,
                ...(isRedirecting ? { pointerEvents: "none" } : {}),
              }}
              MenuProps={{
                PaperProps: { sx: hoursRestStyles.selectMenuPaper },
              }}
            >
              <MenuItem value="" disabled sx={styles.menuItem}>
                {loading ? t("common.loading") : t("activeController.select")}
              </MenuItem>
              {users.map((controller) => (
                <MenuItem key={controller._id} value={controller._id}>
                  <Typography sx={hoursRestStyles.hoursDescription}>
                    {controller.username}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
      </Box>

      <Box sx={styles.buttonContainer}>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={styles.submitButton}
          onClick={handleContinueClick}
          disabled={isRedirecting}
        >
          {isRedirecting ? (
            <CircularProgress size={24} sx={adminStyles.Text} />
          ) : (
            <Typography sx={styles.submitButtonText} component="span">
              {t("activeController.continueButton")}
            </Typography>
          )}
        </Button>
      </Box>
    </Container>
  );
}
