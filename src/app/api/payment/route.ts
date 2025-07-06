// app/api/payment/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Your configured PrismaClient instance

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId, theatreId, userId, amount} = await req.json();

    const user = await prisma.users.findUnique({
        where: { id: userId }
    })


    if(!user) return NextResponse.json({success: false, message: "User not found"});
    const balance = user.balance;

    if(user.balance! >= amount) {
        await prisma.users.update({
            where: { id: userId },
            data: { balance: { decrement: amount } }
        });
    }
    else{
        return NextResponse.json({status : 401, success: false, message: "Insufficient balance"});
    }

    const movie = await prisma.movies.findUnique({ where: { id: movieId } });
    const theatre = await prisma.theatres.findUnique({ where: { id: theatreId } });

   if(movie && theatre) {

       const commission = movie!.commission;
       const movieCut = amount * (commission / 100);
       const theatreCut = amount - movieCut;

       console.log("Movie Cut", movieCut);
       console.log("Theatre Cut", theatreCut);

       await prisma.users.update({
           where: {id: movie.vendor_id},
           data: {balance: {increment: movieCut}}
       });

       await prisma.users.update({
           where: {id: theatre.vendor_id},
           data: {balance: {increment: theatreCut}}
       });


       return NextResponse.json({success: true, balance:balance});
   }
   return NextResponse.json({success: false, message: "Movie or Theatre not found"});
}
