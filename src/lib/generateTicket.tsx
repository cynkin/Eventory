import { renderToBuffer } from '@react-pdf/renderer';
import ConcertPDF from '@/myComponents/Event/ConcertPDF';
import React from 'react';
import TicketPDF from "@/myComponents/Event/TicketPDF";
import TrainPDF from "@/myComponents/Event/TrainPDF";

export async function generateTicket(ticketData: any, qrCodeBase64: string) {
    return await renderToBuffer(
        <TicketPDF ticket={ticketData} qrCodeBase64={qrCodeBase64} />
    );
}
export async function generateConcertTicket(ticketData: any, qrCodeBase64: string) {
    return await renderToBuffer(
        <ConcertPDF ticket={ticketData} qrCodeBase64={qrCodeBase64} />
    );
}

export async function generateTrainTicket(ticketData: any, qrCodeBase64: string, bookedSeats:any) {
    return await renderToBuffer(
        <TrainPDF ticket={ticketData} qrCodeBase64={qrCodeBase64} bookedSeats={bookedSeats} />
    );
}