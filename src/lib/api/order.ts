import { api } from "@/lib/api/axios";
import type { ApiSuccess } from "@/types/auth";
import type {
  CheckoutPayload,
  CheckoutResponse,
  GetMyOrdersParams,
  MyOrdersResponse,
} from "@/types/order";

export async function checkout(payload: CheckoutPayload) {
  const { data } = await api.post<ApiSuccess<CheckoutResponse>>(
    "/api/order/checkout",
    payload
  );
  return data.data;
}

export async function getMyOrders(params: GetMyOrdersParams) {
  const { data } = await api.get<ApiSuccess<MyOrdersResponse>>(
    "/api/order/my-order",
    { params }
  );
  return data.data;
}
