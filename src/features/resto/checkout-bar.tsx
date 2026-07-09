import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import type { CartGroup } from "@/types/cart";

export function CheckoutBar({ group }: { group?: CartGroup }) {
  if (!group || group.items.length === 0) return null;

  const totalItems = group.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white px-6 py-3 sm:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <BagIcon />
            {totalItems} Items
          </div>
          <p className="mt-1 font-bold text-neutral-900">
            {formatRupiah(group.subtotal)}
          </p>
        </div>

        <Link
          href="/checkout"
          className="rounded-full bg-primary-100 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M6 7V6a6 6 0 1 1 12 0v1h2a1 1 0 0 1 1 1l1 13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1l1-13a1 1 0 0 1 1-1h2Zm2 0h8V6a4 4 0 0 0-8 0v1Z" />
    </svg>
  );
}
