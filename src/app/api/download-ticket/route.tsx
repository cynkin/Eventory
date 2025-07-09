'use server'
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import TicketPDF from '@/myComponents/Event/TicketPDF';
import ConcertPDF from '@/myComponents/Event/ConcertPDF';
import QRCode from 'qrcode';
import React from 'react';
import TrainPDF from "@/myComponents/Event/TrainPDF";

export async function POST(req: Request) {
    const body = await req.json();

    const event = body.booking_id ? "movie" : body.concert? "concert" : "train";

    const id = event === "movie" ? body.booking_id : body.id;
    let qr;
    try{
        qr = await QRCode.toDataURL(JSON.stringify({id}));
    }
    catch(err){
        console.log(err);
        return;
    }

    let pdfBuffer;
    if(event === "movie") {
       pdfBuffer = await renderToBuffer(
            <TicketPDF ticket={body} qrCodeBase64={qr}/>
        );
    }
    if(event === "concert") {
        pdfBuffer = await renderToBuffer(
            <ConcertPDF ticket={body} qrCodeBase64={qr}/>
        );
    }
    if(event === "train") {
        pdfBuffer = await renderToBuffer(
            <TrainPDF ticket={body} qrCodeBase64={qr} bookedSeats={body.bookedSeats}/>
        )
    }

    return new NextResponse(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="download-ticket.pdf"',
        },
    });
}