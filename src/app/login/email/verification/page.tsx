'use client';
import Image from "next/image"
import logo from "@/images/logo.png"
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {useSession} from "next-auth/react";

const inputStyle = " my-6 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#1568e3] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"
const buttonStyle = "w-full transition-all duration-200 tracking-wider  rounded-full px-9 py-3.5 text-lg font-semibold mt-3 bg-[#1568e3] text-white hover:bg-[#0d4eaf]"

export default function VerificationPage() {
    const [otp, setOTP] = useState('');
    const router = useRouter();
    const [error, setError] = useState("");
    const {data: session, status} = useSession();
    const [email, setEmail] = useState("");

    const searchParams = useSearchParams();
    const searchEmail = searchParams.get("email");
    const change = searchParams.get("change");
    let register = searchParams.get("register");

    useEffect(() => {
        if(!searchEmail && change !== "password") return;
        let email = "";
        if(searchEmail){
            setEmail(searchEmail);
            email = searchEmail;
        }
        if(change === "password"){
            if(!session || !session.user || !session.user.email) return;
            email = session.user.email;
            setEmail(email);
        }
        console.log("Session: ", session);
        const sendCode = async () => {
            await fetch("/api/send-otp", {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({email})
            })
        }
        sendCode();
        
    }, [searchEmail, session, change])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp") as string;

        const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email, otp})
        })

        if(!res.ok){
            setError("Invalid code");
            return;
        }
        if(register !== "true" || change === "password") register = "false";
        router.push("/login/create-password?email="+email+"&register="+register);
    }

    return (
            <div className="flex justify-center items-center">
                <div className="w-[460px]">
                    <div className="flex flex-col items-center ">
                        <Image src={logo} alt="logo" className="m-9" width={200} height={120} />
                        <div className="self-start text-3xl tracking-wide font-semibold">Let&#39;s confirm your email</div>
                        <div className="mt-2 pl-2 self-start text-gray-700 text-md">
                            <div>To continue, enter the secure code sent to {email}. Check junk mail if it’s not in your inbox.</div>
                            <div className="tracking-wide text-lg"></div>
                        </div>


                        <form onSubmit={handleSubmit} className="w-full " method="post">
                            <input type="text" name="otp" placeholder="6-digit code" className={inputStyle}
                                   value={otp} onChange={(e) => {setOTP(e.target.value); setError("");}}/>

                            <button type="submit"
                                    className={buttonStyle}>
                                Continue</button>
                            {error && <div className="text-lg text-red-500 mt-4 transition-all duration-400">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>

    )
}