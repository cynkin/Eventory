import { create } from 'zustand';
import {TheatreData, TrainData, SeatLayout, Slot} from "../../types/eventStore";

interface EventStore {
    theatreData: TheatreData | null;
    seatLayout: SeatLayout| null;
    trainData: TrainData | null;
    slot: Slot | null;

    setTheatreData: (data: TheatreData) => void;
    setLayout: (data: SeatLayout) => void;
    setTrainData: (data: TrainData) => void;
    setSlot: (data: Slot) => void;

    clear: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
    theatreData:null,
    seatLayout:null,
    trainData:null,
    slot:null,

    setTheatreData : (data) => set({theatreData : data}),
    setLayout : (data) => set({seatLayout: data}),
    setTrainData : (data) => set({trainData: data}),
    setSlot : (data) => set({slot: data}),

    clear: ()=> set({theatreData:null, seatLayout:null, trainData:null, slot:null}),
}));