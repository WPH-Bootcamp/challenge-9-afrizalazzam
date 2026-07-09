import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedAddress } from "@/types/address";

type AddressInput = Omit<SavedAddress, "id" | "isDefault">;

type AddressState = {
  addresses: SavedAddress[];
  hasHydrated: boolean;
  addAddress: (input: AddressInput) => void;
  updateAddress: (id: string, input: AddressInput) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      hasHydrated: false,
      addAddress: (input) =>
        set((state) => ({
          addresses: [
            ...state.addresses,
            {
              ...input,
              id: crypto.randomUUID(),
              isDefault: state.addresses.length === 0,
            },
          ],
        })),
      updateAddress: (id, input) =>
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.id === id ? { ...address, ...input } : address
          ),
        })),
      removeAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter(
            (address) => address.id !== id
          );
          const removedWasDefault = state.addresses.find(
            (address) => address.id === id
          )?.isDefault;
          if (removedWasDefault && remaining.length > 0) {
            remaining[0].isDefault = true;
          }
          return { addresses: remaining };
        }),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "address-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
