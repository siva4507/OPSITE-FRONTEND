"use client";

import React, { useState } from "react";
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
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { RegisterDto, RegisterData } from "@/src/dto/auth.dto";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { register as registerThunk } from "@/src/store/slices/authSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { styles } from "../../styles/auth.styles";
import PasswordCriteria, {
  areAllPasswordConditionsMet,
} from "../common/passwordCondition";
import { useWatch } from "react-hook-form";
import { AlertType } from "@/src/types/types";
import { imageUrls, navigationUrls } from "@/src/utils/constant";

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfrimPassword, setConfrimShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterDto),
  });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const onSubmit = async (data: RegisterData) => {
    if (!areAllPasswordConditionsMet(data.password, data.confirmPassword)) {
      dispatch(
        showAlert({
          message: t("passwordCondition.completeAll"),
          type: AlertType.Error,
        }),
      );
      return;
    }
    setIsRedirecting(true);
    try {
      await dispatch(registerThunk(data)).unwrap();
      dispatch(
        showAlert({
          message: t("signup.success"),
          type: AlertType.Success,
        }),
      );
      setTimeout(() => {
        router.push(navigationUrls.login);
      }, 3000);
    } catch (error: unknown) {
      let errorMessage: string;
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = t("signup.error");
      }
      setIsRedirecting(false);
      dispatch(
        showAlert({
          message: errorMessage,
          type: AlertType.Error,
        }),
      );
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(navigationUrls.login);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
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

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              required
              label={`${t("signup.username")}`}
              margin="normal"
              variant="standard"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={styles.inputField}
              autoComplete="off"
            />

            <TextField
              fullWidth
              required
              label={`${t("signup.email")}`}
              margin="normal"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={styles.inputField}
            />

            <TextField
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              label={`${t("login.passwordLabel")}`}
              margin="normal"
              size="medium"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={styles.inputField}
              variant="standard"
              slotProps={{
                input: {
                  inputProps: { maxLength: 16 },
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
            <Box
              sx={{
                minHeight: password ? "auto" : "0px",
                overflow: "hidden",
                transition: "min-height 0.3s ease-in-out",
                mt: password ? 0.2 : 0,
              }}
            >
              <PasswordCriteria
                password={password}
                confirmPassword={confirmPassword}
              />
            </Box>

            <TextField
              fullWidth
              required
              type={showConfrimPassword ? "text" : "password"}
              label={`${t("signup.confirmPassword")}`}
              margin="normal"
              size="medium"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={styles.inputField}
              variant="standard"
              slotProps={{
                input: {
                  inputProps: { maxLength: 16 },
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
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
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
                  {t("signup.signUp")}
                </Typography>
              )}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={styles.loginfooter}
            >
              {" "}
              {t("signup.redirectLogin")}{" "}
              <Link
                href="#"
                onClick={handleLoginClick}
                variant="body2"
                color="primary"
                sx={styles.forgotPasswordLink}
              >
                {t("login.loginButton")}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SignUp;
