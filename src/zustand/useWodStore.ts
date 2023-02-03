import { create } from 'zustand';
import { WodFormValuesProps } from '../sections/@dashboard/real/workout/WodNewForm';

interface WodState {
  wod: WodFormValuesProps | null;
  add: (wod: WodFormValuesProps | null) => void;
}

export const useWodStore = create<WodState>()((set) => ({
  wod: null,
  add: (wod: WodFormValuesProps | null) => set(() => ({ wod })),
}));
