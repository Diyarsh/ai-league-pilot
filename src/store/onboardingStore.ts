import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  currentStep: number;
  completed: boolean;
  demoAccountExpiry: number | null;
  skipOnboarding: boolean;
  isOpen: boolean;
  nextStep: () => void;
  prevStep: () => void;
  skip: () => void;
  complete: () => void;
  setDemoExpiry: (expiry: number) => void;
  reset: () => void;
  open: () => void;
  close: () => void;
}

const TOTAL_STEPS = 6;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Always start from step 1 if not completed
      currentStep: 1,
      completed: false,
      demoAccountExpiry: null,
      skipOnboarding: false,
      isOpen: false,
      
      nextStep: () =>
        set((state) => {
          if (state.currentStep >= TOTAL_STEPS) {
            return { completed: true, currentStep: TOTAL_STEPS };
          }
          return { currentStep: state.currentStep + 1 };
        }),
      
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),
      
      skip: () => {
        set({ skipOnboarding: true, completed: false, isOpen: false });
      },
      
      complete: () => {
        set({ completed: true, currentStep: TOTAL_STEPS, isOpen: false });
      },
      
      setDemoExpiry: (expiry: number) => set({ demoAccountExpiry: expiry }),
      
      reset: () =>
        set({
          currentStep: 1,
          completed: false,
          demoAccountExpiry: null,
          skipOnboarding: false,
          isOpen: false,
        }),
      
      open: () => set({ isOpen: true }),
      
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'onboarding-storage',
    }
  )
);

