'use client';
import { Suspense } from "react";
import TrainForm from "@/myComponents/Form/TrainForm"

export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <TrainForm/>
        </Suspense>
    )
}