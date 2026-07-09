import { api } from "@/lib/api/axios";
import type {
  ApiSuccess,
  AuthData,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<ApiSuccess<AuthData>>(
    "/api/auth/register",
    payload
  );
  return data.data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<ApiSuccess<AuthData>>(
    "/api/auth/login",
    payload
  );
  return data.data;
}

export async function getProfile() {
  const { data } = await api.get<ApiSuccess<User>>("/api/auth/profile");
  return data.data;
}

export async function updateProfile(formData: FormData) {
  const { data } = await api.put<ApiSuccess<User>>(
    "/api/auth/profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.data;
}
