export type Date ={
    date: string;
    cost:number;
    eliteCost: number;
    timeSlots:Time[];
}

export type Time = {
    time:string;
    language:string;
}

export type Station ={
    date: string;
    location:string;
    time:string;
    cost:number;
}

export interface MovieDetails{
    id:string;
    title: string;
    description: string;
    ageRating:string;
    duration:number;
    genres: string[];
    image:string;
}

export interface ConcertType {
    id: string;
    title: string;
    seats: number;
    cost: number;
    languages:string[];
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
    description: string;
    vendor_id: string;
    start_date : string;
    end_date : string;
    // createdAt: Date;
}

export interface TheatreData {
    location: string;
    dates: Date[];
}

// {
//     id: string;
//     title: string;
//     vendor_id: string;
//     createdAt: Date;
//     train_id: number;
//     compartments: number;
//     additional: number;
//     stations: JsonValue;
//     seatLayout: JsonValue;
// }[]

export interface TrainData {
    id: string;
    title: string;
    train_id: number;
    compartments: number;
    additional:number;
    stations : Station[];
}

export interface Theatre{
    location : string,
    seatLayout : Seat[][],
    vendorId : string
}

export type SeatStatus = "available" | "booked" | "held" | "select" | "locked";

export type SeatLayout = {
    layout: Seat[][];
}

export type Slot = {
    showId : string,
    theatreId : string,
    date: string,
    time: string,
    language: string,
    seats : Seat[][],
    cost: number,
    premiumCost : number,
}

export type Seat = {
    type: "regular" | "vip" | "disabled";
    status: SeatStatus;
    code: string;
};


