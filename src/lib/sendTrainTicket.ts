import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { generateTrainTicket } from './generateTicket';

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

export async function sendTrainTicket(ticketData: any, userEmail: string, id: string, bookedSeats:any) {
    const qr = await QRCode.toDataURL(JSON.stringify({ id }));
    const pdfBuffer = await generateTrainTicket(ticketData, qr, bookedSeats);
    console.log(ticketData, "sendTrainTicket");

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
        subject: `Ticket for ${ticketData.title} on ${formatDate(ticketData.from.date)}`,
        text: "Thank you for choosing! For check-in, please download the ticket attached below!",
        attachments: [
            {
                filename: `ticket_${id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    });
}
