import axios from "axios";
import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
} from "@/src/dto/auth.dto";
import { API_ENDPOINTS } from "@/src/utils/endpoints";

export const registerUser = async (data: RegisterData) => {
  const { username, email, password } = data;
  const res = await axios.post(API_ENDPOINTS.REGISTER, {
    username,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (data: LoginData) => {
  const { email, password } = data;
  const res = await axios.post(API_ENDPOINTS.LOGIN, { email, password });
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  const res = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
    email: data.email,
  });
  return res.data;
};

export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  const res = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
    token,
    newPassword,
  });
  return res.data;
};
