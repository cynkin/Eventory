import { NextRequest, NextResponse } from "next/server";
import { sendTicket } from "@/lib/sendTicket";

export async function POST(req: NextRequest) {
    try {
        const { ticketData, email } = await req.json();

        if (!email || !ticketData?.booking_id) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        await sendTicket(ticketData, email);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error sending download-ticket:", err);
        return NextResponse.json({ error: "Failed to send download-ticket" }, { status: 500 });
    }
}
