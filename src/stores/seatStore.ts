import { create } from 'zustand';

type SelectedSeats = string[];

interface seatStore {
    selectedSeats: SelectedSeats;
    setSelectedSeats: (data: SelectedSeats) => void;
}

export const useSeatStore = create<seatStore>((set) => ({
    selectedSeats: [],
    setSelectedSeats: (data) => set({selectedSeats: data}),
}));