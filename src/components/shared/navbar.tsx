"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/lib/query/useCart";
import { useProfile } from "@/lib/query/useAuth";
import { cn } from "@/lib/utils";

type NavbarProps = {
  variant?: "transparent" | "solid";
};

export function Navbar({ variant = "transparent" }: NavbarProps) {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { data: cart } = useCart();
  const isTransparent = variant === "transparent";
  const cartCount = cart?.summary.totalItems ?? 0;

  return (
    <header
      className={cn(
        "z-20 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6",
        isTransparent
          ? "absolute inset-x-0 top-0"
          : "relative border-b border-neutral-200 bg-white"
      )}
    >
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2",
          isTransparent ? "text-white" : "text-neutral-900"
        )}
      >
        <Image
          src={isTransparent ? "/images/logo-putih.png" : "/images/logo.png"}
          alt="Foody logo"
          width={28}
          height={28}
          className="h-6 w-6 sm:h-7 sm:w-7"
        />
        <span className="hidden text-lg font-bold sm:inline sm:text-2xl">
          Foody
        </span>
      </Link>

      {hasHydrated &&
        (token ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/cart" aria-label="Cart" className="relative">
              <Image
                src="/images/cart.png"
                alt="Cart"
                width={24}
                height={24}
                className={cn("h-6 w-6", !isTransparent && "invert")}
              />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-red px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <ProfileMenu isTransparent={isTransparent} />
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition sm:px-6 sm:py-2 sm:text-sm",
                isTransparent
                  ? "border-white text-white hover:bg-white/10"
                  : "border-neutral-300 text-neutral-900 hover:bg-neutral-50"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition sm:px-6 sm:py-2 sm:text-sm",
                isTransparent
                  ? "bg-white text-neutral-900 hover:bg-neutral-100"
                  : "bg-primary-100 text-white hover:opacity-90"
              )}
            >
              Sign Up
            </Link>
          </div>
        ))}
    </header>
  );
}

function ProfileMenu({ isTransparent }: { isTransparent: boolean }) {
  const [open, setOpen] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const { data: profile } = useProfile();

  const handleLogout = () => {
    setToken(null);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Profile menu"
        className={cn(
          "block h-9 w-9 overflow-hidden rounded-full border-2 sm:h-10 sm:w-10",
          isTransparent ? "border-white" : "border-neutral-200"
        )}
      >
        <Image
          src={profile?.avatar || "/images/avatar.png"}
          alt="Profile"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl bg-white p-4 text-left shadow-xl">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <Image
                src={profile?.avatar || "/images/avatar.png"}
                alt="Profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-semibold text-neutral-900">
                {profile?.name ?? "..."}
              </span>
            </Link>

            <div className="mt-4 flex flex-col gap-1 border-t border-neutral-200 pt-3">
              <MenuItem
                icon={<PinIcon />}
                label="Delivery Address"
                href="/profile/address"
              />
              <MenuItem
                icon={<OrdersIcon />}
                label="My Orders"
                href="/orders"
              />
              <MenuItem
                icon={<LogoutIcon />}
                label="Logout"
                onClick={handleLogout}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  href,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-100";

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4M16 2v4M4 8h16" />
      <rect x="4" y="4" width="16" height="18" rx="2" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
