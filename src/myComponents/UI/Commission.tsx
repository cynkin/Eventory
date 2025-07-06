import {useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import {Dot} from "lucide-react";

export default function Commission({commission}: { commission: number}) {
    const { data: session, status } = useSession();
    if (status === "loading") return (<Spinner/>);
    return(
        <>
            {session && session.user.role === "vendor" &&
                <>
                    <Dot className="w-9 h-auto"/>
                    <div className="text-nowrap"><span className="text-red-500 text-lg  font-bold">{commission}% </span> Commission</div>
                </>
            }
        </>
    )
}