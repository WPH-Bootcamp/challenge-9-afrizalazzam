"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useProfile } from "@/lib/query/useAuth";

const navItems = [
  { label: "Delivery Address", href: "/profile/address", icon: <PinIcon /> },
  { label: "My Orders", href: "/orders", icon: <OrdersIcon /> },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const setToken = useAuthStore((state) => state.setToken);

  return (
    <div className="hidden w-64 shrink-0 lg:block">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <Link href="/profile" className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
            <Image
              src={profile?.avatar || "/images/avatar.png"}
              alt={profile?.name ?? "Profile"}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-neutral-900">
            {profile?.name ?? "..."}
          </span>
        </Link>

        <div className="mt-4 flex flex-col gap-1 border-t border-neutral-200 pt-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-primary-100"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setToken(null)}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
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
      className="h-5 w-5 shrink-0"
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
      className="h-5 w-5 shrink-0"
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
