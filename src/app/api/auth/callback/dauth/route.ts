import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const DAUTH_CLIENT_ID = process.env.DAUTH_CLIENT_ID!;
const DAUTH_CLIENT_SECRET = process.env.DAUTH_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DAUTH_REDIRECT_URI!;

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    // console.log("Code", code);
    if (!code) return NextResponse.redirect("/login/email");

    // console.log("Code", code);
    const tokenRes = await fetch("https://auth.delta.nitt.edu/api/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id:DAUTH_CLIENT_ID,
            client_secret: DAUTH_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    console.log("Access token", accessToken);

    if (!accessToken) return NextResponse.redirect("http://localhost:3000/login/email");

    const userInfoRes = await fetch("https://auth.delta.nitt.edu/api/resources/user", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },

    });

    const dAuthUser = await userInfoRes.json();

    console.log("DAuthUser user", dAuthUser);
    const { email, name} = dAuthUser;
    if (!email) return NextResponse.redirect("http://localhost:3000/login/email");

    let user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.users.create({
            data: {
                email,
                name,
                role: "user",
                balance: 1000,
                google_id: "new",
            },
        });

        await prisma.contact.create({
            data: {
                id: user.id,
                mobile_no: dAuthUser.phoneNumber,
                gender: dAuthUser.gender,
            },
        });
    }

    return NextResponse.redirect(`http://localhost:3000/success/dauth?email=${encodeURIComponent(email)}`);
}