import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { useAuthStore } from "@/store/auth";

export function useCart() {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: hasHydrated && !!token,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
