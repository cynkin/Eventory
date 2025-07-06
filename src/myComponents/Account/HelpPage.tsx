import { useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import {ChevronRight} from "lucide-react";
import Link from "next/link";
import {MessagesSquare} from "lucide-react";

export default function SecurityPage() {
    const { data: session, status } = useSession();
    if (status === "loading") return <Spinner />;
    return(
        <>
            {session
                ?
                <div className="w-full border pt-13 pb-11 px-12 border-gray-300 rounded-xl m-5">
                    <div className="text-3xl font-bold">
                        Help and Feedback
                    </div>

                    <div className="text-sm mb-5">Have questions or feedback for us? We&#39;re listening.</div>
                    <Link href="#" className="flex mt-5 items-center border rounded-xl p-2 border-gray-300 w-fit">
                        <MessagesSquare className="ml-1 mr-4"/>
                        <div className="w-53 py-2 font-medium">Chat now</div>
                        <ChevronRight className=""/>
                    </Link>

                    <Link href="#" className="flex mt-5 items-center border rounded-xl p-2 border-gray-300 w-fit">
                        <div className="w-64 py-2 px-2 font-medium">Share your feedback</div>
                        <ChevronRight className=""/>
                    </Link>
                </div>
                : <div>Login</div>
            }
        </>
    )
}