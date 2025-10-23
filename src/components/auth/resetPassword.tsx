"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { ResetPasswordDto, ResetPasswordData } from "@/src/dto/auth.dto";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { resetPasswordAction } from "@/src/store/slices/authSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { styles } from "../../styles/auth.styles";
import PasswordCriteria, {
  areAllPasswordConditionsMet,
} from "../common/passwordCondition";
import { useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AlertType } from "@/src/types/types";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { imageUrls, navigationUrls } from "@/src/utils/constant";

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfrimPassword, setConfrimShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = decodeURIComponent(window.location.search);
      const match = search.match(/token=([^&]+)/);
      if (match && match[1]) {
        setToken(match[1]);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordDto),
  });

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(navigationUrls.login);
  };

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const onSubmit = async (data: ResetPasswordData) => {
    if (!areAllPasswordConditionsMet(data.password, data.confirmPassword)) {
      dispatch(
        showAlert({
          message: t("passwordCondition.completeAll"),
          type: AlertType.Error,
        }),
      );
      return;
    }
    if (!token) {
      dispatch(
        showAlert({
          message: t("resetPassword.tokenMissing"),
          type: AlertType.Error,
        }),
      );
      return;
    }
    try {
      const result = await dispatch(
        resetPasswordAction({ token, newPassword: data.password }),
      ).unwrap();

      setIsRedirecting(true);
      dispatch(
        showAlert({
          message: result.message || t("resetPassword.successMessage"),
          type: AlertType.Success,
        }),
      );
      setTimeout(() => router.push(navigationUrls.login), 3000);
    } catch (error: unknown) {
      setIsRedirecting(false);
      let errorMessage: string;
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = t("resetPassword.errorMessage");
      }
      dispatch(showAlert({ message: errorMessage, type: AlertType.Error }));
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Grid sx={styles.formContainer}>
        <Box
          component="div"
          sx={styles.backgroundOverlay(`${imageUrls.bgPic}`)}
        />
        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Box
              component="img"
              src={imageUrls.logo}
              alt="Logo"
              sx={styles.logo}
            />
            <Box sx={styles.headerContainer}>
              <Typography variant="h5" sx={styles.title}>
                {t("resetPassword.title")}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label={t("resetPassword.newPassword")}
                margin="normal"
                size="medium"
                value={password}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={styles.inputField}
                variant="standard"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                          sx={styles.iconButtonSmall}
                        >
                          {showPassword ? (
                            <VisibilityOutlined sx={{ color: "#fff" }} />
                          ) : (
                            <VisibilityOffOutlined sx={{ color: "#fff" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {password && (
                <PasswordCriteria
                  password={password}
                  confirmPassword={confirmPassword}
                />
              )}
              <TextField
                fullWidth
                type={showConfrimPassword ? "text" : "password"}
                label={t("resetPassword.confirmPassword")}
                margin="normal"
                size="medium"
                {...register("confirmPassword")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={styles.inputField}
                variant="standard"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setConfrimShowPassword(!showConfrimPassword)
                          }
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="small"
                          sx={styles.iconButtonSmall}
                        >
                          {showConfrimPassword ? (
                            <VisibilityOutlined sx={{ color: "#fff" }} />
                          ) : (
                            <VisibilityOffOutlined sx={{ color: "#fff" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || isRedirecting}
                sx={styles.loginButtonStyle}
              >
                {loading || isRedirecting ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  <Typography sx={styles.buttonText} component="span">
                    {t("resetPassword.resetPassword")}
                  </Typography>
                )}
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={styles.loginfooter}
                onClick={handleLoginClick}
              >
                <KeyboardArrowLeftIcon
                  sx={styles.icon}
                  onClick={handleLoginClick}
                />
                {t("resetPassword.RedirectLogin")}{" "}
                <Link
                  href="#"
                  variant="body2"
                  color="primary"
                  sx={styles.forgotPasswordLink}
                  style={{ marginLeft: 2 }}
                >
                  {t("login.loginButton")}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ResetPassword;
