"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  type AddressFormValues,
} from "@/lib/validations/checkout";

export function DeliveryAddressCard({
  value,
  onChange,
}: {
  value: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
}) {
  const [isEditing, setIsEditing] = useState(
    value.deliveryAddress.trim().length === 0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: value,
  });

  const onSubmit = (values: AddressFormValues) => {
    onChange(values);
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <PinIcon />
        <h2 className="font-semibold text-neutral-900">Delivery Address</h2>
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-3 flex flex-col gap-3"
        >
          <div>
            <textarea
              {...register("deliveryAddress")}
              placeholder="Alamat lengkap pengiriman"
              rows={2}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
            />
            {errors.deliveryAddress && (
              <p className="mt-1 text-xs text-accent-red">
                {errors.deliveryAddress.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              {...register("phone")}
              placeholder="Nomor telepon"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-accent-red">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("notes")}
              placeholder="Catatan (opsional)"
              rows={2}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="self-start rounded-full bg-primary-100 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Simpan
          </button>
        </form>
      ) : (
        <>
          <p className="mt-3 text-sm text-neutral-700">
            {value.deliveryAddress}
          </p>
          <p className="text-sm text-neutral-700">{value.phone}</p>
          {value.notes && (
            <p className="mt-1 text-sm text-neutral-500">
              Catatan: {value.notes}
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-3 rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            Change
          </button>
        </>
      )}
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-primary-100"
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
