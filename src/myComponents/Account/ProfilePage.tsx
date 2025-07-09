import { useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import {notFound, useSearchParams} from "next/navigation";
import Link from "next/link";
import SidePanel from "@/myComponents/Account/SidePanel";
import ProfileForm from "@/myComponents/Account/ProfileForm";
import ContactForm from "@/myComponents/Account/ContactForm";
import {useEffect, useState} from "react";

function capitalize(str: string) {
    if (!str) return "";
    str = str.split(" ")[0];
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const edit = searchParams.get('edit');

    const [contact, setContact] = useState<any>([]);

    const userId = session?.user.id;
    useEffect(() => {
        if(!userId) return;

        const fetchContactDetails = async () => {
            const res = await fetch(`/api/get/contact-details`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId})
                })
            if(!res.ok) throw new Error("Something went wrong");
            const data = await res.json();
            setContact(data);
            console.log(data);
        };

        fetchContactDetails();

    }, [userId]);


    if (status === "loading") return <Spinner />;
    if(!session) notFound()

    return(
        <>
            {edit === 'basic-info' ?
                <div className="flex justify-center items-center w-full">
                    <ProfileForm/>
                </div>

            : edit === 'contact-info' ?
                <div className="flex justify-center items-center w-full">
                    <ContactForm/>
                </div>
            :
            <div className="flex flex-row">
                <SidePanel/>
                <div className="w-full border pt-13 pb-11 px-12 border-gray-300 rounded-xl m-5">
                <div className="text-3xl font-bold">
                    {capitalize(session.user.name || "")}
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <div className="text-[28px] font-medium mt-12">Basic Information</div>
                        <Link href="/account/profile?edit=basic-info" className="font-[500] rounded-4xl px-2 py-2 transition-all duration-200  hover:bg-blue-50 text-blue-600 hover:cursor-pointer">Edit</Link>
                    </div>
                    <div className="text-sm mb-5">Make sure this information matches your travel ID, like your passport or licence</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-[15px] text-[#0f172a]">
                        <div>
                            <div className="font-semibold">Name</div>
                            <div>{session.user.name}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Bio</div>
                            <div>{contact && contact.bio ? contact.bio : "Not provided"}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Date of birth</div>
                            <div>{contact && contact.date_of_birth ? formatDate(contact.date_of_birth) : "Not provided"}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Gender</div>
                            <div>{contact && contact.gender ? contact.gender.toUpperCase() : "Not provided"}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Profile Picture</div>
                            <div>{contact && contact.profile_pic
                                ? <div className="rounded-full border-2 mt-5 w-20 h-20 relative overflow-hidden">
                                    <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                         src={contact.profile_pic}  />
                                </div>
                                : "Not provided"}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-[28px] font-medium mt-12">Contact</div>
                        <Link href="/account/profile?edit=contact-info" className="font-[500] rounded-3xl px-2 py-2 transition-all duration-200  hover:bg-blue-50 text-blue-600 hover:cursor-pointer">Edit</Link>
                    </div>
                    <div className="text-sm mb-5">Receive account activity alerts and trip updates by sharing this information</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-[15px] text-[#0f172a]">
                        <div>
                            <div className="font-semibold">Mobile Number</div>
                            <div>{contact && contact.mobile_no ? contact.mobile_no : "Not provided"}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Email</div>
                            <div>{session.user.email}</div>
                        </div>
                        {/*<div>*/}
                        {/*    <div className="font-semibold">Emergency Contact</div>*/}
                        {/*    <div>Not provided</div>*/}
                        {/*</div>*/}
                        <div>
                            <div className="font-semibold">Address</div>
                            <div>{contact && contact.address ? contact.address: "Not provided"}</div>
                        </div>
                    </div>

                </div>
            </div>
            </div>
            }
        </>
    )
}