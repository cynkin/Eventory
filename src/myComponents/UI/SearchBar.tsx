// import Search from "@/images/search.png"
import {Search} from "lucide-react"
import {useRouter} from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q") as string;
        router.push(`/search?q=${q}`);
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex items-center">
                <div className="relative w-full">
                    <input type="text"
                           name="q"
                           placeholder="Search for events...."
                           className="w-full border ml-12 my-2 py-3 pl-12 text-sm tracking-wide border-gray-300 rounded-3xl
                           shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1568e3] hover:shadow-md focus:shadow-xl
                           focus:border-transparent transition-all duration-200"
                    />
                    <Search className="absolute left-15 top-1/2 -translate-y-1/2"/>
                </div>
                <button type="submit" className="ml-14  mr-32 bg-[#1568e3] rounded-3xl px-6 py-3 text-white text-sm
                 transition-all duration-200 hover:bg-[#0d4eaf]">
                    Search
                </button>
            </form>

        </div>
    )
}