"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLastOrderStore } from "@/store/last-order";
import { formatRupiah } from "@/lib/utils";

export function SuccessContent() {
  const router = useRouter();
  const transaction = useLastOrderStore((state) => state.transaction);

  useEffect(() => {
    if (!transaction) {
      router.replace("/");
    }
  }, [transaction, router]);

  if (!transaction) {
    return null;
  }

  const totalItems = transaction.restaurants.reduce(
    (sum, group) =>
      sum + group.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 px-6 py-12">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="Foody logo" width={28} height={28} />
        <span className="text-2xl font-bold text-neutral-900">Foody</span>
      </Link>

      <div className="mt-8 w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green">
            <CheckIcon />
          </div>
          <h1 className="mt-4 font-bold text-neutral-900">Payment Success</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Your payment has been successfully processed.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-dashed border-neutral-200 pt-4 text-sm">
          <Row
            label="Date"
            value={new Date(transaction.createdAt).toLocaleString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Row label="Payment Method" value={transaction.paymentMethod} />
          <Row
            label={`Price ( ${totalItems} items)`}
            value={formatRupiah(transaction.pricing.subtotal)}
          />
          <Row
            label="Delivery Fee"
            value={formatRupiah(transaction.pricing.deliveryFee)}
          />
          <Row
            label="Service Fee"
            value={formatRupiah(transaction.pricing.serviceFee)}
          />
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-dashed border-neutral-200 pt-3 text-sm font-bold text-neutral-900">
          <span>Total</span>
          <span>{formatRupiah(transaction.pricing.totalPrice)}</span>
        </div>

        <Link
          href="/orders"
          className="mt-6 block w-full rounded-full bg-primary-100 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
        >
          See My Orders
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-900">{value}</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
