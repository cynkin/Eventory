'use client';
import Image from "next/image"
import logo from "@/images/logo.png"
import React, {useState} from "react";
import {useAuthForm} from "@/app/context/AuthFormContext";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import { useSession } from "next-auth/react";
import updateUser from "@/lib/updateUser";

const inputStyle = " my-2 placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#1568e3] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"

export default function LoginPage() {
    const { data: session, status, update} = useSession();
    const router = useRouter();
    const { email, password, setName, setRole } = useAuthForm();
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const method = searchParams.get("method");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;

        if(name.length < 3){
            setError("Name must be at least 3 characters long");
            return;
        }

        if(method === "google"){
            await updateUser({ name, role});
            if(session){
                await update({
                    user:{
                        name, role
                    }
                })
            }
            router.push("/");
        }
        setName(name);
        setRole(role);

        const res = await fetch("/api/register", {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email, name, role, password})
        })

        if(res?.ok){
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password
            });

            if (response?.error) {
                setError("UNABLE TO SIGN IN AFTER ERROR");
            } else {
                router.push("/"); // or wherever
            }
        }
    }


    return (
        <div className="flex justify-center items-center">
            <div className="w-[460px]">
                <div className="flex flex-col items-center ">
                    <Image src={logo} alt="logo" className="m-9" width={200} height={120} />
                    <div className="self-start text-3xl tracking-wide font-semibold">How do we contact you?</div>
                    <div className="self-start text-lg mb-6">Match your full name to the name you use on official documents, like passport or AADHAR.</div>

                    <form onSubmit={handleSubmit} className="w-full " method="post">
                        <input type="text" name="name" placeholder="Name" className={inputStyle} onChange={()=>setError("")}/>

                        <select
                            name="role"
                            id="role"
                            className="mt-2 block w-full py-3.5 px-4 rounded-lg border border-blue-500 text-lg font-medium text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>

                        </select>

                        <button type="submit" className="w-full tracking-wider transition-all duration-200 bg-[#1568e3] hover:bg-[#0d4eaf] rounded-full px-9 py-3.5 text-white text-lg font-semibold mt-10">Continue</button>
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}