"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useProfile, useUpdateProfile } from "@/lib/query/useAuth";
import { getErrorMessage } from "@/lib/api/error";
import { AccountSidebar } from "@/components/shared/account-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations/profile";

export function ProfileContent() {
  const { isReady } = useRequireAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { name: profile.name, email: profile.email, phone: profile.phone }
      : undefined,
  });

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
        <Skeleton className="h-72 w-full max-w-md rounded-2xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-12">
        <p className="text-sm text-accent-red">
          Gagal memuat profil. Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        setToast("Profil berhasil diperbarui!");
        setTimeout(() => setToast(null), 3000);
      },
    });
  };

  const displayAvatar =
    avatarPreview || profile.avatar || "/images/avatar.png";

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
      <div className="mx-auto flex max-w-5xl gap-6">
        <AccountSidebar />

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>

          <div className="mt-6 max-w-md rounded-2xl bg-white p-6 shadow-sm">
            <div className="relative h-16 w-16">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-neutral-100">
                <Image
                  src={displayAvatar}
                  alt={profile.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Ganti foto profil"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-white"
                >
                  <CameraIcon />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {isEditing ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-5 flex flex-col gap-4"
              >
                <div>
                  <label className="text-sm text-neutral-500">Name</label>
                  <input
                    {...register("name")}
                    className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-100 focus:outline-none"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-accent-red">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-neutral-500">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-100 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-accent-red">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-neutral-500">
                    Nomor Handphone
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary-100 focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-accent-red">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {updateProfile.isError && (
                  <p className="text-sm text-accent-red">
                    {getErrorMessage(updateProfile.error)}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                      reset();
                    }}
                    className="flex-1 rounded-full border border-neutral-300 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="flex-1 rounded-full bg-primary-100 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updateProfile.isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <Row label="Name" value={profile.name} />
                  <Row label="Email" value={profile.email} />
                  <Row label="Nomor Handphone" value={profile.phone} />
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full rounded-full bg-primary-100 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Update Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-900">{value}</span>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
