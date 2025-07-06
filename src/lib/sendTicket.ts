import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { generateTicket } from './generateTicket';

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

export async function sendTicket(ticketData: any, userEmail: string) {
    const qr = await QRCode.toDataURL(JSON.stringify({ id: ticketData.booking_id }));
    const pdfBuffer = await generateTicket(ticketData, qr);

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
        subject: `Ticket for ${ticketData.movie.title} on ${formatDate(ticketData.date)}`,
        text: "Your ticket is attached as a PDF.",
        attachments: [
            {
                filename: `ticket_${ticketData.booking_id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    });
}
