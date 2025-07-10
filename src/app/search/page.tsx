'use client';
import { Suspense } from "react";
import Search from "@/myComponents/Suspense/Search"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <Search/>
        </Suspense>
    )
}