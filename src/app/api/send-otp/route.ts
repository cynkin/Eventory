import { NextRequest, NextResponse } from "next/server";
import {sendOTP} from "@/lib/sendOTP";
import {otpRateLimiter} from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
    try {
        const {email} = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        console.log("Email", email);

        const {success} = await otpRateLimiter.limit(email);
        if(!success){
            return NextResponse.json({error: "Too many requests. Try again after some time."})
        }
        await sendOTP(email);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error sending OTP:", err);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
