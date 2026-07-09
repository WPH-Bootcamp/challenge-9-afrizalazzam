"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useCart, useClearCart } from "@/lib/query/useCart";
import { useCheckout } from "@/lib/query/useOrder";
import { useLastOrderStore } from "@/store/last-order";
import { formatRupiah } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api/error";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemRow } from "@/features/cart/cart-item-row";
import { DeliveryAddressCard } from "@/features/checkout/delivery-address-card";
import type { AddressFormValues } from "@/lib/validations/checkout";

const FALLBACK_LOGO = "/images/restaurant-placeholder.png";
const DELIVERY_FEE = 10000;
const SERVICE_FEE = 1000;

const paymentMethods = [
  {
    id: "Bank Negara Indonesia",
    label: "Bank Negara Indonesia",
    logo: "/images/banks/bni.png",
  },
  {
    id: "Bank Rakyat Indonesia",
    label: "Bank Rakyat Indonesia",
    logo: "/images/banks/bri.png",
  },
  {
    id: "Bank Central Asia",
    label: "Bank Central Asia",
    logo: "/images/banks/bca.png",
  },
  { id: "Mandiri", label: "Mandiri", logo: "/images/banks/mandiri.png" },
];

export function CheckoutContent() {
  const router = useRouter();
  const { isReady } = useRequireAuth();
  const { data: cart, isLoading, isError } = useCart();
  const checkoutMutation = useCheckout();
  const clearCartMutation = useClearCart();
  const setTransaction = useLastOrderStore((state) => state.setTransaction);

  const [address, setAddress] = useState<AddressFormValues>({
    deliveryAddress: "",
    phone: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isReady) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-12">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-12">
        <p className="text-sm text-accent-red">
          Gagal memuat data checkout. Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  if (cart.cart.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 text-center sm:px-12">
        <p className="text-sm text-neutral-500">
          Keranjang kamu masih kosong.
        </p>
        <Link
          href="/resto"
          className="mt-3 inline-block text-sm font-semibold text-primary-100 hover:opacity-80"
        >
          Cari restoran
        </Link>
      </div>
    );
  }

  const totalItems = cart.summary.totalItems;
  const subtotal = cart.summary.totalPrice;
  const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

  const handleBuy = () => {
    if (
      address.deliveryAddress.trim().length < 10 ||
      address.phone.trim().length < 8
    ) {
      setFormError(
        "Lengkapi alamat pengiriman dan nomor telepon terlebih dahulu."
      );
      return;
    }
    setFormError(null);

    checkoutMutation.mutate(
      {
        restaurants: cart.cart.map((group) => ({
          restaurantId: group.restaurant.id,
          items: group.items.map((item) => ({
            menuId: item.menu.id,
            quantity: item.quantity,
          })),
        })),
        deliveryAddress: address.deliveryAddress,
        phone: address.phone,
        paymentMethod,
        notes: address.notes || undefined,
      },
      {
        onSuccess: (data) => {
          setTransaction(data.transaction);
          clearCartMutation.mutate();
          router.push("/checkout/success");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 sm:px-12">
      <h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <DeliveryAddressCard value={address} onChange={setAddress} />

          {cart.cart.map((group) => (
            <div
              key={group.restaurant.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                    <Image
                      src={group.restaurant.logo || FALLBACK_LOGO}
                      alt={group.restaurant.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="truncate font-semibold text-neutral-900">
                    {group.restaurant.name}
                  </span>
                </div>
                <Link
                  href={`/resto/${group.restaurant.id}`}
                  className="shrink-0 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
                >
                  Add item
                </Link>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {group.items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-neutral-900">
              Payment Method
            </h2>
            <div className="mt-3 flex flex-col gap-1">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-3 transition hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
                      <Image
                        src={method.logo}
                        alt={method.label}
                        fill
                        sizes="44px"
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="text-sm text-neutral-900">
                      {method.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="h-4 w-4 accent-primary-100"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-neutral-900">
              Payment Summary
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">
                  Price ({totalItems} items)
                </span>
                <span className="text-neutral-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Delivery Fee</span>
                <span className="text-neutral-900">
                  {formatRupiah(DELIVERY_FEE)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Service Fee</span>
                <span className="text-neutral-900">
                  {formatRupiah(SERVICE_FEE)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-2 font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>

            {formError && (
              <p className="mt-3 text-sm text-accent-red">{formError}</p>
            )}
            {checkoutMutation.isError && (
              <p className="mt-3 text-sm text-accent-red">
                {getErrorMessage(checkoutMutation.error)}
              </p>
            )}

            <button
              type="button"
              onClick={handleBuy}
              disabled={checkoutMutation.isPending}
              className="mt-4 w-full rounded-full bg-primary-100 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutMutation.isPending ? "Memproses..." : "Buy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
