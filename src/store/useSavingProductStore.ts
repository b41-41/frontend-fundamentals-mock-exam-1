import { create } from 'zustand';
import type { SavingsProduct } from '@/types/savingProduct';

interface SavingProductState {
  targetAmount: number;
  monthlyPayment: number;
  savingsPeriod: number;
  selectedProduct: SavingsProduct | null;
  currentTab: 'products' | 'results';
}

interface SavingProductActions {
  setTargetAmount: (amount: number) => void;
  setMonthlyPayment: (amount: number) => void;
  setSavingsPeriod: (period: number) => void;
  setSelectedProduct: (product: SavingsProduct | null) => void;
  setCurrentTab: (tab: 'products' | 'results') => void;
}

type SavingProductStore = SavingProductState & SavingProductActions;

const initialState: SavingProductState = {
  targetAmount: 0,
  monthlyPayment: 0,
  savingsPeriod: 12,
  selectedProduct: null,
  currentTab: 'products',
};

export const useSavingProductStore = create<SavingProductStore>(set => ({
  ...initialState,

  setTargetAmount: amount => set({ targetAmount: amount }),
  setMonthlyPayment: amount => set({ monthlyPayment: amount }),
  setSavingsPeriod: period => set({ savingsPeriod: period }),
  setSelectedProduct: product => set({ selectedProduct: product }),
  setCurrentTab: tab => set({ currentTab: tab }),
}));
