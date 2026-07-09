"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { useLogin } from "@/lib/query/useAuth";
import { getErrorMessage } from "@/lib/api/error";
import { useAuthStore } from "@/store/auth";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { FloatingLabelInput } from "@/components/shared/floating-label-input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setToken(data.token);
        queryClient.setQueryData(["profile"], data.user);
        router.push("/");
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 md:block">
        <Image
          src="/images/login-hero.png"
          alt="Burger with fries and a cold drink"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-col px-6 py-10 sm:px-10 md:w-1/2 md:justify-center md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Foody logo"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0"
            />
            <span className="text-xl font-bold text-neutral-900">Foody</span>
          </div>

          <h1 className="mt-6 text-display-xs font-bold text-neutral-900">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Good to see you again! Let&apos;s eat
          </p>

          <div className="mt-6 flex items-center gap-1 rounded-full bg-neutral-100 p-1">
            <span className="flex-1 rounded-full bg-white py-2 text-center text-sm font-semibold text-neutral-900 shadow-sm">
              Sign in
            </span>
            <Link
              href="/auth/register"
              className="flex-1 rounded-full py-2 text-center text-sm font-medium text-neutral-500 transition hover:text-neutral-700"
            >
              Sign up
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 flex flex-col gap-4"
          >
            {loginMutation.isError && (
              <p className="rounded-lg bg-accent-red/10 px-3 py-2 text-sm text-accent-red">
                {getErrorMessage(loginMutation.error)}
              </p>
            )}

            <FloatingLabelInput
              type="email"
              label="Email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <FloatingLabelInput
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="current-password"
              error={errors.password?.message}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
              {...register("password")}
            />

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 rounded border-neutral-300 accent-primary-100"
              />
              Remember Me
            </label>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-2 w-full rounded-full bg-primary-100 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
