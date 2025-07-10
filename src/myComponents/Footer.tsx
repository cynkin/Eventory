'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";

export default function Footer(){
    const { data: session, status } = useSession();
    const role = session?.user?.role;
    const pathname = usePathname();
    return(
        <>
            {role !== 'admin' &&
                <>
            {!pathname.startsWith('/login') &&
                <footer className="bg-[#f9fafb] text-gray-700 py-6 mt-10 shadow-inner">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="mb-2 md:mb-0">&copy; Copyright {new Date().getFullYear()} Eventory, Inc. All rights reserved.</p>
                        <div className="flex space-x-4">
                            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                            <Link href="/terms" className="hover:underline">Terms of Service</Link>
                            <Link href="/contact" className="hover:underline">Contact</Link>
                        </div>
                    </div>
                </footer>
            }
            </>
            }
        </>
    )
}