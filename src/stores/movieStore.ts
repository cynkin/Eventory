import {create} from 'zustand';
import type {MovieDetails} from "../../types/eventStore";
import {getMovies} from "@/utils/getFromDb";

type MovieStore = {
    movies : MovieDetails[];
    setMovies : (data: MovieDetails[]) => void;
    refreshMovies : () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
    movies: [],
    setMovies: (data) => set({movies: data}),
    refreshMovies: async () => set({movies: await getMovies()}),
}));