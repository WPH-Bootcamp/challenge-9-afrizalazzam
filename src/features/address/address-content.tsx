"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useAddressStore } from "@/store/address";
import { AccountSidebar } from "@/components/shared/account-sidebar";
import { AddressFormModal } from "@/features/address/address-form-modal";
import type { AddressFormValues } from "@/lib/validations/address";
import type { SavedAddress } from "@/types/address";

export function AddressContent() {
  const { isReady } = useRequireAuth();
  const addresses = useAddressStore((state) => state.addresses);
  const addressHasHydrated = useAddressStore((state) => state.hasHydrated);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const removeAddress = useAddressStore((state) => state.removeAddress);
  const setDefaultAddress = useAddressStore(
    (state) => state.setDefaultAddress
  );

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<SavedAddress | null>(null);

  if (!isReady) {
    return null;
  }

  const handleAdd = (values: AddressFormValues) => {
    addAddress(values);
  };

  const handleEdit = (values: AddressFormValues) => {
    if (editTarget) {
      updateAddress(editTarget.id, values);
    }
  };

  const openEdit = (address: SavedAddress) => {
    setEditTarget(address);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8 sm:px-12">
      <div className="mx-auto flex max-w-5xl gap-6">
        <AccountSidebar />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900">
              Delivery Address
            </h1>
            <button
              type="button"
              onClick={() => setModalMode("add")}
              className="rounded-full bg-primary-100 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Tambah Alamat
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {!addressHasHydrated ? null : addresses.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-neutral-500">
                  Belum ada alamat tersimpan.
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PinIcon />
                      <span className="font-semibold text-neutral-900">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <span className="rounded-full bg-primary-100/10 px-2 py-0.5 text-xs font-semibold text-primary-100">
                          Utama
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(address)}
                        aria-label="Edit alamat"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAddress(address.id)}
                        aria-label="Hapus alamat"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-accent-red"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-neutral-700">
                    {address.address}
                  </p>
                  <p className="text-sm text-neutral-500">{address.phone}</p>

                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(address.id)}
                      className="mt-3 text-sm font-semibold text-primary-100 hover:opacity-80"
                    >
                      Jadikan Utama
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {modalMode === "add" && (
        <AddressFormModal
          title="Tambah Alamat"
          onClose={closeModal}
          onSubmit={handleAdd}
        />
      )}

      {modalMode === "edit" && editTarget && (
        <AddressFormModal
          title="Ubah Alamat"
          defaultValues={{
            label: editTarget.label,
            address: editTarget.address,
            phone: editTarget.phone,
          }}
          onClose={closeModal}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-primary-100"
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

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  );
}
