'use client';
import { Suspense } from "react";
import MovieForm from "@/myComponents/Form/MovieForm"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <MovieForm/>
        </Suspense>
    )
}