import {create} from 'zustand';
import type {ConcertType} from "../../types/eventStore";
import {getConcerts} from "@/utils/getFromDb";

type ConcertStore = {
    concerts : ConcertType[];
    setConcerts : (data: ConcertType[]) => void;
    refreshConcerts : () => void;
}

export const useConcertStore = create<ConcertStore>((set) => ({
    concerts: [],
    setConcerts: (data) => set({concerts: data}),
    refreshConcerts: async() => set({concerts: await getConcerts()}),
}));