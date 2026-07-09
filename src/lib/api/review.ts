import { api } from "@/lib/api/axios";
import type { ApiSuccess } from "@/types/auth";
import type {
  CreateReviewPayload,
  MyReviewsResponse,
  UpdateReviewPayload,
} from "@/types/review";

export async function createReview(payload: CreateReviewPayload) {
  const { data } = await api.post<ApiSuccess<unknown>>(
    "/api/review",
    payload
  );
  return data.data;
}

export async function getMyReviews() {
  const { data } = await api.get<ApiSuccess<MyReviewsResponse>>(
    "/api/review/my-reviews",
    { params: { limit: 100 } }
  );
  return data.data;
}

export async function updateReview(id: number, payload: UpdateReviewPayload) {
  const { data } = await api.put<ApiSuccess<unknown>>(
    `/api/review/${id}`,
    payload
  );
  return data.data;
}

export async function deleteReview(id: number) {
  const { data } = await api.delete<ApiSuccess<unknown>>(`/api/review/${id}`);
  return data.data;
}
