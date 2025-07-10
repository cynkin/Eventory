'use client'
import {useEffect, useState} from "react";

export default function Users() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async() =>{
            const res = await fetch('/api/get/users')
            const users = await res.json();
            setUsers(users);
        }

        fetchUsers();
    },[])

    function getWeeks(date:string) {
        const inputDate = new Date(date);
        const now = new Date();
        const diffInMs = now.getTime() - inputDate.getTime();
        return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    }


    return (
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Accounts</div>
                <div className="text-3xl font-medium ml-6 pb-5">Users</div>
                <div className="flex flex-col border-2 border-gray-700">
                    <div className="flex bg-gray-200 items-center  text-gray-700 font-semibold text-center">
                        <div className="w-3/12 py-2 border-r border-gray-800">Customer</div>
                        <div className="w-2/12 py-2 border-r border-gray-800">Role</div>
                        <div className="w-2/12 py-2 border-r border-gray-800">Balance</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Weeks</div>
                        <div className="w-4/12 py-2">Customer ID</div>
                    </div>

                    {users && users.map((user: any, index) => (
                        <div key={index} className="flex text-sm text-gray-800 border-t border-gray-800 items-center text-center">
                            <div className="w-3/12 flex flex-col py-2 ">
                                <div className="font-bold">{user.name}</div>
                                <div className="text-gray-700">{user.email}</div>
                            </div>
                            <div className="w-2/12 py-2 px-2 flex items-center justify-center">
                                <div className={`${user.role === 'user' ? "bg-blue-700" : user.role === 'vendor' ? "bg-[#ffba4c]" : "bg-red-600"} w-4 h-4 rounded-full mr-2`}></div>
                                <div>{user.role.toUpperCase()}</div>
                            </div>

                            <div className="w-2/12 py-2 ">&#8377; {user.balance}</div>
                            <div className="w-1/12 py-2 ">{getWeeks(user.created_at)}</div>
                            <div className="w-4/12 py-2 truncate">{user.id}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}