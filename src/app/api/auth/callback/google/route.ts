import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import {signIn} from "next-auth/react";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect("/login/email");
    // console.log("Code", code);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return NextResponse.redirect("/login/email");

    // console.log("Access token", accessToken);
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const googleUser = await userInfoRes.json();

    console.log("Google user", googleUser);
    const { email, name, id: google_id, picture } = googleUser;
    console.log("picture", picture);
    if (!email) return NextResponse.redirect("/login/email");

    // 3. Create or fetch user
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

        // await prisma.contact.create({
        //     data: {
        //         id: user.id,
        //         profile_pic: picture,
        //     },
        // });
    }

    // 4. Create a custom JWT and set cookie
    const jwt = await createJwt({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: Number(user.balance),
    });

    // console.log("JWT", jwt);

    const res = NextResponse.redirect(`http://localhost:3000/success/google?email=${encodeURIComponent(email)}`);
    res.cookies.set("auth_token", jwt, {
        httpOnly: true,
        secure: false,
        path: "/",
    });

    return res;
}

async function createJwt(payload: Record<string, any>): Promise<string> {
    const header = { alg: "HS256", typ: "JWT" };
    const base64 = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");

    const secret = process.env.NEXTAUTH_SECRET!;
    const unsignedToken = `${base64(header)}.${base64(payload)}`;

    const signature = crypto
        .createHmac("sha256", secret)
        .update(unsignedToken)
        .digest("base64url");

    return `${unsignedToken}.${signature}`;
}
