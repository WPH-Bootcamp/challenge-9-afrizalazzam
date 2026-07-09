import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useProfile() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasHydrated && !!token,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
}
