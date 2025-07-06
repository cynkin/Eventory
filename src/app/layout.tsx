import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { AuthFormProvider } from '@/app/context/AuthFormContext';
import Header from "@/myComponents/Header";
import Footer from "@/myComponents/Footer";
import SessionProviderWrapper from "@/app/SessionProviderWrapper";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

const font = Poppins({
    subsets:["latin"],
    weight:["200", "300", "400", "500", "600"]
})



// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

export const metadata: Metadata = {
    title: "Eventory",
    description: "Book your event with ease.",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
    return (
        <html lang="en">
            <body className={`${font.className} flex flex-col min-h-screen`}>
                <AuthFormProvider>
                    <SessionProviderWrapper>
                        <Header/>
                            <main className="flex-grow">
                                {children}
                            </main>
                        <Footer/>
                    </SessionProviderWrapper>
                </AuthFormProvider>
            </body>
        </html>
    );
}
