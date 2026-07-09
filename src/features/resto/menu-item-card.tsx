"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
  useAddToCart,
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/lib/query/useCart";
import { formatRupiah } from "@/lib/utils";
import type { MenuItem } from "@/types/resto";

const FALLBACK_IMAGE = "/images/restaurant-placeholder.png";

export function MenuItemCard({
  menu,
  restaurantId,
}: {
  menu: MenuItem;
  restaurantId: number;
}) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const cartItem = cart?.cart
    .find((group) => group.restaurant.id === restaurantId)
    ?.items.find((item) => item.menu.id === menu.id);

  const quantity = cartItem?.quantity ?? 0;
  const isMutating =
    addToCart.isPending || updateCartItem.isPending || removeCartItem.isPending;

  const handleAdd = () => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    addToCart.mutate({ restaurantId, menuId: menu.id, quantity: 1 });
  };

  const handleIncrease = () => {
    if (!cartItem) return;
    updateCartItem.mutate({ id: cartItem.id, quantity: cartItem.quantity + 1 });
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeCartItem.mutate(cartItem.id);
    } else {
      updateCartItem.mutate({ id: cartItem.id, quantity: cartItem.quantity - 1 });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-square w-full bg-neutral-100">
        <Image
          src={menu.image || FALLBACK_IMAGE}
          alt={menu.foodName}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm text-neutral-500">{menu.foodName}</p>
        <p className="mt-1 font-semibold text-neutral-900">
          {formatRupiah(menu.price)}
        </p>

        <div className="mt-3">
          {quantity > 0 ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={isMutating}
                aria-label="Kurangi jumlah"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                −
              </button>
              <span className="min-w-4 text-center text-sm font-semibold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isMutating}
                aria-label="Tambah jumlah"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isMutating}
              className="w-full rounded-full bg-primary-100 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addToCart.isPending ? "..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
