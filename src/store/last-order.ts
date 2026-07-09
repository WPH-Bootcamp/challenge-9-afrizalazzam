import { create } from "zustand";
import type { Transaction } from "@/types/order";

type LastOrderState = {
  transaction: Transaction | null;
  setTransaction: (transaction: Transaction) => void;
};

export const useLastOrderStore = create<LastOrderState>((set) => ({
  transaction: null,
  setTransaction: (transaction) => set({ transaction }),
}));
