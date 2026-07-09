"use client";

import { useState } from "react";
import {
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
} from "@/lib/query/useReview";
import { getErrorMessage } from "@/lib/api/error";

type ExistingReview = {
  id: number;
  star: number;
  comment: string;
};

export function ReviewModal({
  transactionId,
  restaurantId,
  restaurantName,
  existingReview,
  onClose,
  onSuccess,
}: {
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  existingReview?: ExistingReview;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const [star, setStar] = useState(existingReview?.star ?? 5);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const isPending =
    createReview.isPending || updateReview.isPending || deleteReview.isPending;
  const error =
    createReview.error || updateReview.error || deleteReview.error;

  const handleSubmit = () => {
    if (existingReview) {
      updateReview.mutate(
        { id: existingReview.id, payload: { star, comment: comment || undefined } },
        {
          onSuccess: () => {
            onSuccess("Review berhasil diperbarui!");
            onClose();
          },
        }
      );
      return;
    }

    createReview.mutate(
      { transactionId, restaurantId, star, comment: comment || undefined },
      {
        onSuccess: () => {
          onSuccess("Review berhasil dikirim!");
          onClose();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!existingReview) return;
    if (!window.confirm("Hapus review ini?")) return;
    deleteReview.mutate(existingReview.id, {
      onSuccess: () => {
        onSuccess("Review berhasil dihapus.");
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-bold text-neutral-900">
          {existingReview ? "Ubah Review" : "Beri Review"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{restaurantName}</p>

        <div className="mt-4 flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStar(value)}
              aria-label={`${value} bintang`}
            >
              <StarIcon filled={value <= star} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ceritakan pengalaman kamu (opsional)"
          rows={3}
          maxLength={500}
          className="mt-4 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
        />

        {error && (
          <p className="mt-2 text-sm text-accent-red">
            {getErrorMessage(error)}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="mt-4 w-full rounded-full bg-primary-100 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Memproses..."
            : existingReview
              ? "Simpan Perubahan"
              : "Kirim Review"}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="mt-2 w-full rounded-full py-2.5 text-sm font-semibold text-accent-red transition hover:bg-accent-red/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Hapus Review
          </button>
        )}
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-8 w-8 ${filled ? "fill-accent-yellow" : "fill-neutral-200"}`}
    >
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.27 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}
