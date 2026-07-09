"use client";

import Image from "next/image";
import { useRemoveCartItem, useUpdateCartItem } from "@/lib/query/useCart";
import { formatRupiah } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

const FALLBACK_IMAGE = "/images/restaurant-placeholder.png";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const isMutating = updateCartItem.isPending || removeCartItem.isPending;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      removeCartItem.mutate(item.id);
    } else {
      updateCartItem.mutate({ id: item.id, quantity: item.quantity - 1 });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={item.menu.image || FALLBACK_IMAGE}
          alt={item.menu.foodName}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-500">
          {item.menu.foodName}
        </p>
        <p className="mt-1 font-semibold text-neutral-900">
          {formatRupiah(item.menu.price)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={isMutating}
          aria-label="Kurangi jumlah"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-semibold text-neutral-900">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() =>
            updateCartItem.mutate({ id: item.id, quantity: item.quantity + 1 })
          }
          disabled={isMutating}
          aria-label="Tambah jumlah"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          +
        </button>
      </div>
    </div>
  );
}
