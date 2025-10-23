import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import { ProfileResponseDto } from "@/src/types/profile.types";

export const fetchProfile = async (): Promise<ProfileResponseDto> => {
  const response = await api.get<ProfileResponseDto>(
    API_ENDPOINTS.FETCH_PROFILE,
  );
  return response.data;
};
