'use client'
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Ban, UserRoundX} from "lucide-react";

export default function Users() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);


    useEffect(() => {
        const fetchUsers = async() =>{
            const res = await fetch('/api/get/users')
            const users = await res.json();
            console.log(users);
            setUsers(users.filter((user:any) => user.role !== 'admin'));
        }

        fetchUsers();
        setFetching(false);
    },[fetching])

    function getWeeks(date:string) {
        const inputDate = new Date(date);
        const now = new Date();
        const diffInMs = now.getTime() - inputDate.getTime();
        return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    }

    const suspendUser = (id:string, action:string) => async () => {
        const confirmed = action ==='suspended' ? window.confirm("Are you sure you want to unsuspend this user?") : window.confirm("Are you sure you want to suspend this user?");
        if (!confirmed) return;

        const res = await fetch("/api/user/suspend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user_id: id, action})
        })

        if(res.ok) {
            if (action !== 'suspended') alert("User suspended successfully");
            else alert("User unsuspended successfully");
            setFetching(true);
        }
        else alert("Failed to suspend user");
    }

    const deleteUser = (id:string) => async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        const res = await fetch("/api/user/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id })
        });

        if (res.ok) {
            alert("User deleted successfully");
            setFetching(true);
        } else {
            alert("Failed to delete user");
        }
    }
    return (
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Accounts</div>
                <div className="text-3xl font-medium ml-6 pb-5">Users</div>
                <div className="flex flex-col border-2 border-gray-700">
                    <div className="flex bg-gray-200 items-center  text-gray-700 font-semibold text-center">
                        <div className="w-3/12 py-2 border-r border-gray-800">Customer</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Role</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Balance</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Weeks</div>
                        <div className="w-4/12 py-2 border-r border-gray-800">Customer ID</div>
                        <div className="w-2/12 py-2">Actions(Suspend/Delete)</div>
                    </div>

                    {users && users.map((user: any, index) => (
                        <div key={index} className={`flex text-sm ${user.id === id && 'bg-yellow-50'} text-gray-800 border-t border-gray-800 items-center text-center`}>
                            <div className="w-3/12 flex flex-col py-2 ">
                                <div className="font-bold">{user.name}</div>
                                <div className="text-gray-700">{user.email}</div>
                            </div>
                            <div className="w-1/12 py-2 px-2 flex items-center justify-center">
                                <div className={`${user.role === 'user' ? "bg-blue-700" : user.role === 'vendor' ? "bg-[#ffba4c]" : "bg-red-600"} w-4 h-4 rounded-full mr-2`}></div>
                                <div>{user.role.toUpperCase()}</div>
                            </div>

                            <div className="w-1/12 py-2 ">&#8377; {user.balance}</div>
                            <div className="w-1/12 py-2 ">{getWeeks(user.created_at)}</div>
                            <Link href={"#"} className="w-4/12 hover:bg-black hover:text-white transition-all duration-300 py-2">{user.id}</Link>
                            <div className="w-2/12 flex px-15 flex-row justify-between transition-all duration-300  truncate">
                                <Ban onClick={suspendUser(user.id, user.google_id)} className={`cursor-pointer ${user.google_id === 'suspended' ? 'text-red-500 hover:text-green-500' : 'text-green-500 hover:text-red-500' }`}/>
                                <div className="cursor-pointer rounded-full p-1 hover:bg-red-500 hover:text-white text-red-500"><UserRoundX onClick={deleteUser(user.id)} className=""/></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}