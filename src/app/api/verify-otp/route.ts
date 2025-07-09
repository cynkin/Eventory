import { NextRequest, NextResponse } from "next/server";
import {redis} from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const {email, otp} = await req.json();

        console.log("Email", email, otp);

        if (!email || !otp || otp.length !== 6) {
            return NextResponse.json({ error: "Missing data/Invalid OTP" }, { status: 400 });
        }

        console.log("Email", email);
        console.log("OTP", otp);

        const storedOtp = await redis.get('otp_' + email);
        console.log("Stored OTP", storedOtp);

        if(String(otp) !== String(storedOtp)){
            return NextResponse.json({ error: "Incorrect OTP" }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error sending OTP:", err);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
