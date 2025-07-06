import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import TicketPDF from '@/myComponents/Event/TicketPDF';
import ConcertPDF from '@/myComponents/Event/ConcertPDF';
import QRCode from 'qrcode';
import React from 'react';

export async function POST(req: Request) {
    const body = await req.json();

    const event = body.movie ? "movie" : "concert";

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

    return new NextResponse(pdfBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="ticket.pdf"',
        },
    });
}