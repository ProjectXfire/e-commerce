import { create } from 'zustand';
import { IModal } from '../interfaces';

export const useModal = create<IModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));
