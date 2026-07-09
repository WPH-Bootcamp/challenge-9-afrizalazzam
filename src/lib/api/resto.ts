import { api } from "@/lib/api/axios";
import type { ApiSuccess } from "@/types/auth";
import type {
  GetBestSellerParams,
  GetNearbyParams,
  GetRestaurantDetailParams,
  GetRestaurantsParams,
  NearbyResponse,
  RestaurantDetail,
  RestaurantListResponse,
  SearchRestaurantsParams,
} from "@/types/resto";

export async function getRestaurants(params: GetRestaurantsParams) {
  const { data } = await api.get<ApiSuccess<RestaurantListResponse>>(
    "/api/resto",
    { params }
  );
  return data.data;
}

export async function searchRestaurants(params: SearchRestaurantsParams) {
  const { data } = await api.get<ApiSuccess<RestaurantListResponse>>(
    "/api/resto/search",
    { params }
  );
  return data.data;
}

export async function getNearbyRestaurants(params: GetNearbyParams) {
  const { data } = await api.get<ApiSuccess<NearbyResponse>>(
    "/api/resto/nearby",
    { params }
  );
  return data.data;
}

export async function getBestSellerRestaurants(params: GetBestSellerParams) {
  const { data } = await api.get<ApiSuccess<RestaurantListResponse>>(
    "/api/resto/best-seller",
    { params }
  );
  return data.data;
}

export async function getRestaurantDetail(
  id: number,
  params: GetRestaurantDetailParams = {}
) {
  const { data } = await api.get<ApiSuccess<RestaurantDetail>>(
    `/api/resto/${id}`,
    { params }
  );
  return data.data;
}
