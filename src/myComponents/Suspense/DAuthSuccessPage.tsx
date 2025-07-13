"use client"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function DAuthSuccessPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const password = process.env.NEXT_PUBLIC_DAUTH_PASSWORD!
    useEffect(() => {
        if (!email) return;

        const Login = async() => {
            await signIn("credentials", {
                email,
                password,
                redirect: true,
                callbackUrl: "/",
            });
        }

        Login();
    }, [email, password]);

    return <p>Signing you in...</p>
}