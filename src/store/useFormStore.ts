import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  password: string;
  country: string;
  avatar: string;
  submittedAt: number;
}

export type FormInput = Omit<FormData, 'id' | 'submittedAt'>;

interface FormStore {
  submissions: FormData[];
  addSubmission: (data: FormInput) => void;
  clearSubmissions: () => void;
  countries: string[];
}

const defaultCountries = [
  'Россия', 'США', 'Канада', 'Великобритания', 'Германия', 'Франция', 'Италия', 
  'Испания', 'Китай', 'Япония', 'Индия', 'Бразилия', 'Австралия', 'Мексика',
  'Украина', 'Беларусь', 'Казахстан', 'Польша', 'Турция', 'ОАЭ'
];

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      submissions: [],
      addSubmission: (data) =>
        set((state) => ({
          submissions: [
            ...state.submissions,
            {
              ...data,
              id: crypto.randomUUID(),
              submittedAt: Date.now(),
            },
          ],
        })),
      clearSubmissions: () => set({ submissions: [] }),
      countries: defaultCountries,
    }),
    {
      name: 'form-storage',
    }
  )
);