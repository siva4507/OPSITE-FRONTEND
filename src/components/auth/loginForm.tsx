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
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { LoginDto, LoginData } from "@/src/dto/auth.dto";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  login,
  setOnboardingCompleted,
  setRememberMe,
  setSelectedRoles,
} from "@/src/store/slices/authSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { showAlert } from "@/src/store/slices/alertSlice";
import {
  storeToken,
  clearAuthToken,
  clearImpersonateToken,
  isAuthenticated,
} from "@/src/utils/authToken";
import { AlertType } from "@/src/types/types";
import { imageUrls, navigationUrls } from "@/src/utils/constant";
import { getPrimaryRole } from "@/src/utils/config";
import { Role, UserRole } from "@/src/types/auth.types";
import { styles } from "../../styles/auth.styles";
import { clearDashboardData } from "@/src/store/slices/dashboardSlice";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, selectedRole } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [rememberMe, setRememberMeState] = useState(false);

  useEffect(() => {
    const hasValidToken = isAuthenticated();
    if (hasValidToken) {
      router.replace(navigationUrls.dashboard);
      return;
    }
    clearAuthToken();
    clearImpersonateToken();
    clearDashboardData();
    setOnboardingCompleted(false);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(LoginDto),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      const { token, user } = result;

      if (!token || !user) throw new Error(t("login.loginFailed"));

      const roles = user.roles?.map((r: Role) => r.name) ?? [];
      const primaryRole = getPrimaryRole(roles);

      dispatch(setSelectedRoles(primaryRole));
      const activeShiftCount = result.activeShiftCount;
      dispatch(setRememberMe(rememberMe));
      storeToken(token, rememberMe);
      dispatch(
        showAlert({ message: t("login.success"), type: AlertType.Success }),
      );

      setIsRedirecting(true);

      if (selectedRole === UserRole.ActiveController && activeShiftCount > 0) {
        dispatch(setOnboardingCompleted(true));
      }
    } catch (error) {
      setIsRedirecting(false);
      setError("email", {
        message: typeof error === "string" ? error : t("login.loginFailed"),
      });
      dispatch(
        showAlert({ message: t("login.loginFailed"), type: AlertType.Error }),
      );
    }
  };

  return (
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
              {t("login.title")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={styles.subtitle}
            >
              {t("login.subtitle")}
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label={t("login.emailLabel")}
              margin="normal"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={styles.inputField}
            />
          
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label={t("login.passwordLabel")}
              margin="normal"
              variant="standard"
              sx={{
                ...styles.inputField,
                "& input::-ms-reveal, & input::-ms-clear": {
                  display: "none !important",
                },
              }}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
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
            <Box sx={styles.rememberForgotContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMeState(e.target.checked)}
                    size="small"
                    sx={styles.checkboxWhite}
                  />
                }
                label={
                  <Typography variant="body2">
                    {t("login.rememberMe")}
                  </Typography>
                }
              />
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(navigationUrls.forgotPassword);
                }}
                variant="body2"
                color="primary"
                sx={styles.forgotPasswordLink}
              >
                {t("login.forgotPassword")}
              </Link>
            </Box>
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
                  {t("login.loginButton")}
                </Typography>
              )}
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={styles.loginfooter}
            >
              {t("login.RedirectSignUp")}{" "}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(navigationUrls.signUp);
                }}
                variant="body2"
                color="primary"
                sx={styles.forgotPasswordLink}
              >
                {t("login.SignUp")}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LoginForm;
