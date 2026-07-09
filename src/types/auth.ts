export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: string[];
};

export type AuthData = {
  user: User;
  token: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
