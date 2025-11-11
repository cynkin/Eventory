"use client";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight">RECAL Scholarship Admin</h1>
                <div className="space-x-3">
                    <Button variant="ghost">Create Scholarship</Button>
                    <Button variant="ghost">Scholarships</Button>
                    <Button variant="ghost">Logout</Button>
                </div>
            </div>
        </nav>
    );
}
