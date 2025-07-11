import crypto from "crypto";

export function decodeJwt(token: string) {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) throw new Error("Malformed JWT");

    const secret = process.env.NEXTAUTH_SECRET!;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${header}.${payload}`)
        .digest("base64url");

    if (signature !== expectedSignature) throw new Error("Invalid JWT signature");

    return JSON.parse(Buffer.from(payload, "base64url").toString());
}
