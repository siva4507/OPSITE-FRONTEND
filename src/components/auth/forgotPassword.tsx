"use client";

import React from "react";
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
} from "@mui/material";
import { ForgotPasswordDto, ForgotPasswordData } from "@/src/dto/auth.dto";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { forgot } from "@/src/store/slices/authSlice";
import { useTranslation } from "@/src/hooks/useTranslation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { styles } from "../../styles/auth.styles";
import { useRouter } from "next/navigation";
import { AlertType } from "@/src/types/types";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { imageUrls, navigationUrls } from "@/src/utils/constant";

const ForgetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordDto),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const result = await dispatch(forgot(data)).unwrap();
      dispatch(
        showAlert({
          message: result.message || t("forgotPassword.successMessage"),
          type: AlertType.Success,
        }),
      );
      reset();
    } catch (error: unknown) {
      let errorMessage: string;
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = t("forgotPassword.errorMessage");
      }
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
              {t("forgotPassword.title")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={styles.subtitle}
            >
              {t("forgotPassword.subtitle")}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label={t("forgotPassword.emailLabel")}
              margin="normal"
              variant="standard"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={styles.inputField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={styles.loginButtonStyle}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                <Typography sx={styles.buttonText} component="span">
                  {t("forgotPassword.sendLink")}
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
              {t("forgotPassword.RedirectLogin")}{" "}
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
  );
};

export default ForgetPassword;
