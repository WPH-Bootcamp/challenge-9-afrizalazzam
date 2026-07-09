"use client";

import Image from "next/image";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useCart, useClearCart } from "@/lib/query/useCart";
import { formatRupiah } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemRow } from "@/features/cart/cart-item-row";
import type { CartGroup } from "@/types/cart";

const FALLBACK_IMAGE = "/images/restaurant-placeholder.png";

export function CartContent() {
  const { isReady } = useRequireAuth();
  const { data, isLoading, isError } = useCart();
  const clearCart = useClearCart();

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
        <Skeleton className="h-40 w-full max-w-3xl rounded-2xl" />
        <Skeleton className="mt-4 h-40 w-full max-w-3xl rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 sm:px-12">
        <p className="text-sm text-accent-red">
          Gagal memuat keranjang. Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  if (data.cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center sm:px-12">
        <p className="text-sm text-neutral-500">Keranjang kamu masih kosong.</p>
        <Link
          href="/resto"
          className="mt-3 inline-block text-sm font-semibold text-primary-100 hover:opacity-80"
        >
          Cari restoran
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">My Cart</h1>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Kosongkan seluruh keranjang?")) {
                clearCart.mutate();
              }
            }}
            disabled={clearCart.isPending}
            className="text-sm font-semibold text-accent-red hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Kosongkan Cart
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {data.cart.map((group) => (
            <RestaurantCartGroup key={group.restaurant.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RestaurantCartGroup({ group }: { group: CartGroup }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <Link
        href={`/resto/${group.restaurant.id}`}
        className="flex items-center gap-2"
      >
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md bg-neutral-100">
          <Image
            src={group.restaurant.logo || FALLBACK_IMAGE}
            alt={group.restaurant.name}
            fill
            sizes="24px"
            className="object-cover"
          />
        </div>
        <span className="font-semibold text-neutral-900">
          {group.restaurant.name}
        </span>
        <ChevronIcon />
      </Link>

      <div className="mt-4 flex flex-col gap-4">
        {group.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-4">
        <div>
          <p className="text-sm text-neutral-500">Total</p>
          <p className="font-bold text-neutral-900">
            {formatRupiah(group.subtotal)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-primary-100 px-8 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-neutral-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
