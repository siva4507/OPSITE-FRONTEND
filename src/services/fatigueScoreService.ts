import api from "./api";
import { API_ENDPOINTS } from "@/src/utils/endpoints";
import {
  FatigueScoreResponseDto,
  FatigueScoreRequestParams,
  AddFatigueScoreRequestDto,
  EditFatigueScoreRequestDto,
} from "@/src/types/fatigueScore.types";

/**
 * Fetch fatigue scores with optional search, sort, and pagination
 * @param params - Filter, sort, and pagination parameters
 * @returns Paginated fatigue score response
 */
export const fetchFatigueScores = (params?: FatigueScoreRequestParams) => {
  const query = new URLSearchParams();

  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  return api.get<FatigueScoreResponseDto>(
    `${API_ENDPOINTS.FATIGUE_SCORE}?${query.toString()}`,
  );
};

/**
 * Add a new fatigue score interpretation
 * @param payload - Fatigue score data to add
 * @returns Newly created fatigue score
 */
export const addFatigueScore = async (
  payload: AddFatigueScoreRequestDto,
): Promise<FatigueScoreResponseDto["data"]["data"][0]> => {
  const response = await api.post<FatigueScoreResponseDto["data"]["data"][0]>(
    API_ENDPOINTS.FATIGUE_SCORE,
    payload,
  );
  return response.data;
};

/**
 * Edit an existing fatigue score interpretation
 * @param scoreId - ID of the fatigue score to update
 * @param payload - Data to update
 * @returns Updated fatigue score
 */
export const editFatigueScore = async (
  scoreId: string,
  payload: EditFatigueScoreRequestDto,
): Promise<FatigueScoreResponseDto["data"]["data"][0]> => {
  const response = await api.put<FatigueScoreResponseDto["data"]["data"][0]>(
    `${API_ENDPOINTS.FATIGUE_SCORE}/${scoreId}`,
    payload,
  );
  return response.data;
};

/**
 * Delete a fatigue score interpretation
 * @param scoreId - ID of the fatigue score to delete
 * @returns Success message
 */
export const deleteFatigueScore = async (
  scoreId: string,
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `${API_ENDPOINTS.FATIGUE_SCORE}/${scoreId}`,
  );
  return response.data;
};
