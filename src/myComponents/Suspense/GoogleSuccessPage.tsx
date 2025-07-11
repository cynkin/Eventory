"use client"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function GoogleSuccessPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    useEffect(() => {
        if (!email) return;

        const Login = async() => {
            await signIn("credentials", {
                email,
                password: "google",
                redirect: true,
                callbackUrl: "/", // or dashboard
            });
        }

        Login();
    }, [email]);

    return <p>Signing you in...</p>
}