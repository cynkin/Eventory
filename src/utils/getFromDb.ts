'use server'
import prisma from "@/lib/db";

export async function getBalance(userId:string){
    return prisma.users.findUnique({where:{id:userId}, select:{balance:true}});
}

export async function getMovies() {
    return prisma.movies.findMany();
}

export async function getConcerts() {
    return prisma.concerts.findMany();
}

export async function getTrains() {
    return prisma.trains.findMany();
}

export async function getConcertShows(id:string){
    return prisma.concert_shows.findMany({where:{concert_id:id}});
}

export async function getConcertShow(id:string){
    return prisma.concert_shows.findUnique({where:{id}});
}

export async function getMovie(id:string){
    return prisma.movies.findUnique({where:{id}});
}

export async function getTheatre(id:string){
    return prisma.theatres.findUnique({where:{id}});
}

export async function getConcert(id:string){
    return prisma.concerts.findUnique({where:{id}});
}

export async function getTrain(id:string){
    return prisma.trains.findUnique({where:{id}});
}

type MovieTicket = {
    amount : number,
    seats: string[],
    time: string,
    date: string,
    location: string,
    movie: {
        title:string,
    },
    language: string,
    booking_id : string,
}

// export async function getUserFromMovie(id:string){
//     const movie = await prisma.movies.findUnique({where:{id}});
//     if(!movie) return new Error("Movie not found");
//     return getUser(movie.vendor_id)
// }
//
// export async function getUserFromTheatre(id:string){
//     const theatre = await prisma.theatres.findUnique({where:{id}});
//     if(!theatre) return new Error("Theatre not found");
//     return getUser(theatre.vendor_id)
// }

export async function getLayout(id:string){
    const show = await prisma.shows.findUnique({where:{id}});
    if(!show) return new Error("Show not found");
    return show.seats;
}

export async function getUser(id:string){
    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) return null;

    return {
        ...user,
        balance: user.balance ? user.balance.toNumber() : 0,
    }
}

export async function getTheatres(date:string, movie_id:string){
    const theatres = await prisma.theatres.findMany({where:{
        movie_id : movie_id,
    }})
    console.log("No. of Theatres:", theatres.length);

    const list = [];
    for(const theatre of theatres){
        const id = theatre.id;
        const tempShows = await prisma.shows.findMany({where:{
                theatre_id : id,
                date : date,
            }})
        console.log("No. of Shows:", tempShows.length, date);
        const slots = [];
        for(const show of tempShows){
            slots.push({
                showId : show.id,
                theatreId : show.theatre_id,
                date: show.date,
                time: show.time,
                language: show.language,
                seats : show.seats,
                cost: show.cost,
                premiumCost : show.premium_cost,
            })
            slots.sort((a, b)=>{
                const [aH, aM] = a.time.split(":").map(Number);
                const [bH, bM] = b.time.split(":").map(Number);
                return aH - bH || aM - bM;
            })
        }
        if(slots.length === 0) continue;
        list.push({
            slots : slots,
            location : theatre.location,
            vendorId : theatre.vendor_id,
        })
    }

    return list;
}
