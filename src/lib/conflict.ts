import { PrismaClient } from "@prisma/client";

type MovieInput = {
    title: string;
    location: string;
    state: string;
    dates: { date: string }[];
};

type TrainInput = {
    trainId: number;
    stations: {
        date: string;
        location: string;
        time: string;
    }[];
}

// export async function checkMovieConflict({title, location, state, dates }: MovieInput,
//     prisma: PrismaClient
// ) {
//     const existingMovies = await prisma.movies.findMany({
//         where: {
//             normalized_title: title,
//             normalized_location: location,
//             normalized_state: state,
//         },
//         select: { id: true, dates: true },
//     });
//
//
//     console.log("Existing Movies", existingMovies);
//     const newDates = dates.map(d => d.date);
//
//     for (const date of newDates) {
//         const conflict = existingMovies.find(movie => {
//             const existingDates = (movie.dates as { date: string }[]).map(d => d.date);
//             return existingDates.includes(date);
//         });
//
//         if (conflict) throw new Error(`Movie with same name already exists on ${date}`);
//     }
//     return true;
// }
//
function compare(a: string, b: string, x: string, y: string) {
    if(x>= a && x<b) return true;
    else if(x<a && y>a) return true;
    return false;
}

export async function checkTrainConflict({trainId, stations}: TrainInput,
                                         prisma: PrismaClient
) {
    const existingTrains = await prisma.trains.findMany({
        where: {
            train_id: trainId,
        },
        select: {
            id: true,
            stations: true },
    });

    for (const train of existingTrains) {
        const existingStations = train.stations as {
            date: string;
            location: string;
            time: string;
        }[];
        const a = existingStations[0].date;
        const b = existingStations[existingStations.length - 1].date;
        const x = stations[0].date;
        const y = stations[stations.length - 1].date;

        const overlap = compare(a, b, x, y);

        if(overlap){
            throw new Error("Overlapping dates found. Please select a different date range.");
            return false;
        }
    }
    return true;
}