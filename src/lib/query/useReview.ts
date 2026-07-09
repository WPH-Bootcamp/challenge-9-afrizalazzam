import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  deleteReview,
  getMyReviews,
  updateReview,
} from "@/lib/api/review";
import type { UpdateReviewPayload } from "@/types/review";
import { useAuthStore } from "@/store/auth";

function useInvalidateReviews() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["reviews", "mine"] });
  };
}

export function useCreateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: createReview,
    onSuccess: invalidate,
  });
}

export function useUpdateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateReviewPayload }) =>
      updateReview(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: invalidate,
  });
}

export function useMyReviews() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["reviews", "mine"],
    queryFn: getMyReviews,
    enabled: hasHydrated && !!token,
  });
}
