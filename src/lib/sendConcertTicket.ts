import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { generateConcertTicket } from './generateTicket';

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

export async function sendConcertTicket(ticketData: any, userEmail: string, id: string) {
    ticketData.id = id;
    const qr = await QRCode.toDataURL(JSON.stringify({ id: ticketData.showId }));
    const pdfBuffer = await generateConcertTicket(ticketData, qr);
    console.log(ticketData, "sendConcertTicket");

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Eventory, Inc" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Ticket for ${ticketData.title} on ${formatDate(ticketData.date)}`,
        text: "Your ticket is attached as a PDF.",
        attachments: [
            {
                filename: `ticket_${id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    });
}
