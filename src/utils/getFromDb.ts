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

export async function checkLocation(location:string){
    const theatre = await prisma.theatres.findMany({where:{location:{equals:location, mode:'insensitive'}}});
    return theatre.length > 0;
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
    // console.log("No. of Theatres:", theatres.length);

    const list = [];
    for(const theatre of theatres){
        const id = theatre.id;
        const tempShows = await prisma.shows.findMany({where:{
                theatre_id : id,
                date : date,
            }})
        // console.log("No. of Shows:", tempShows.length, date);
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

type Concert = {
    title: string,
    description: string,
    ageRating: string,
    seats: number,
    genres: string[],
    languages: string[],
    cost: number,
    duration: number,
    image: string,
    details: {
        date: string,
        time: string,
        location: string,
    }[]
}

export async function addConcerts(){
    const dataSet = [

    ] as Concert[];

    for (const data of dataSet) {
        await addConcert(data);
    }
}

export async function addConcert(data:Concert){

    const vendor_id = "155a14cd-c945-41bb-844b-942da25eb483"
    data.details.sort((a,b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    })

    const concert = await prisma.concerts.create({
        data: {
            title: data.title.trim(),
            description: data.description,
            ageRating: data.ageRating,
            seats:data.seats,
            genres: data.genres,
            languages: data.languages,
            cost: data.cost,
            duration:data.duration,
            image: data.image,
            start_date: data.details[0].date,
            end_date: data.details[data.details.length-1].date,
            vendor: {
                connect: {id: vendor_id}
            }
        }
    })

    await Promise.all(
        data.details.map(detail =>
            prisma.concert_shows.create({
                data: {
                    date: detail.date,
                    time: detail.time,
                    seats: data.seats,
                    location: detail.location,
                    concert: {
                        connect: { id: concert.id }
                    }
                }
            })
        )
    );
}
