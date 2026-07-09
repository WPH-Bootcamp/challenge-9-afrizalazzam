"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressFormSchema,
  type AddressFormValues,
} from "@/lib/validations/address";

export function AddressFormModal({
  title,
  defaultValues,
  onClose,
  onSubmit,
}: {
  title: string;
  defaultValues?: AddressFormValues;
  onClose: () => void;
  onSubmit: (values: AddressFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: defaultValues ?? { label: "", address: "", phone: "" },
  });

  const submit = (values: AddressFormValues) => {
    onSubmit(values);
    onClose();
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
        <h2 className="font-bold text-neutral-900">{title}</h2>

        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="mt-4 flex flex-col gap-3"
        >
          <div>
            <input
              {...register("label")}
              placeholder="Label (mis. Rumah, Kantor)"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
            />
            {errors.label && (
              <p className="mt-1 text-xs text-accent-red">
                {errors.label.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              {...register("address")}
              placeholder="Alamat lengkap"
              rows={3}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-100 focus:outline-none"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-accent-red">
                {errors.address.message}
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

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary-100 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
