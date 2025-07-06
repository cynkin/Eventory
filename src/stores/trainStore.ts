import {create} from 'zustand';
import type {TrainData, Station} from "../../types/eventStore";
import {getTrains} from "@/utils/getFromDb";

type TrainStore = {
    trains : TrainData[];
    setTrains : (data: TrainData[]) => void;
    refreshTrains : () => void;
}

export const useTrainStore = create<TrainStore>((set) => ({
    trains: [],
    setTrains: (data) => set({trains: data}),
    refreshTrains: async () => {
        const raw = await getTrains();
        const casted = raw.map(train => ({
            ...train,
            stations: (train.stations ?? []) as Station[],
        }));
        set({ trains: casted });
    }
}));