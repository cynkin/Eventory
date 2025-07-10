'use client'
import Image from 'next/image'
import logo from "@/images/logo.png"
import SearchBar from "@/myComponents/UI/SearchBar";
import Profile from "@/myComponents/UI/Profile"

import Link from "next/link";
import {usePathname} from "next/navigation";
import {SessionProvider} from "next-auth/react";
import {useSession} from "next-auth/react";


export default function Header() {
    const { data: session, status } = useSession();
    const role = session?.user?.role;
    const pathname = usePathname();
    return(
        <>
            {role !== 'admin' &&
                <>
                    {!pathname.startsWith('/login') && !pathname.endsWith("/seatLayout") && !pathname.endsWith("/payment") &&
                        <>
                            <div className="flex justify-between xl:px-44 transiton-all duration-1000 dark:bg-[#191e3b] shadow-md">
                                <div className="w-full flex items-center">
                                    <Link href="/" className="">
                                        <Image src={logo} alt="logo" className="m-6" width={160} height={120}/>
                                    </Link>
                                    <SearchBar />
                                </div>
                                <SessionProvider>
                                    <Profile/>
                                </SessionProvider>
                            </div>
                            <div className="h-[1px] bg-gray-300 relative">
                                <div className="absolute left-0 right-0 w-full h-[4px] bg-gradient-to-b from-gray-300 to-transparent" />
                            </div>
                        </>
                    }
                    {pathname.endsWith('/payment') &&
                        <>
                            <Link href="/" className="xl:px-44">
                                <Image src={logo} alt="logo" className="m-6" width={160} height={120}/>
                            </Link>

                            <div className="h-[1px] bg-gray-300 relative">
                                <div className="absolute left-0 right-0 w-full h-[4px] bg-gradient-to-b from-gray-300 to-transparent" />
                            </div>
                        </>
                    }
                </>
            }

        </>
    )
}