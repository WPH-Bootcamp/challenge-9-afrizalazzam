import { api } from "@/lib/api/axios";
import type { ApiSuccess } from "@/types/auth";
import type { AddToCartPayload, CartResponse } from "@/types/cart";

export async function getCart() {
  const { data } = await api.get<ApiSuccess<CartResponse>>("/api/cart");
  return data.data;
}

export async function addToCart(payload: AddToCartPayload) {
  const { data } = await api.post<ApiSuccess<unknown>>("/api/cart", payload);
  return data.data;
}

export async function updateCartItem(id: number, quantity: number) {
  const { data } = await api.put<ApiSuccess<unknown>>(`/api/cart/${id}`, {
    quantity,
  });
  return data.data;
}

export async function removeCartItem(id: number) {
  const { data } = await api.delete<ApiSuccess<unknown>>(`/api/cart/${id}`);
  return data.data;
}

export async function clearCart() {
  const { data } = await api.delete<ApiSuccess<unknown>>("/api/cart");
  return data.data;
}
