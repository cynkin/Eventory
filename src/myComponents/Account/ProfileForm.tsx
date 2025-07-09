import { z } from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {notFound} from "next/navigation";
import { useRouter } from 'next/navigation';
import updateUser from "@/lib/updateUser";
import {useState} from "react";
import Spinner from "@/myComponents/UI/Spinner";

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

const formSchema = z.object({
    name: z.string().min(3, "Name must contain at least 3 characters!"),
    bio: z.string().optional(),
    month: z.string({required_error:"This field is required"}),
    day: z.string({required_error:"This field is required"}),
    year: z.string({required_error:"This field is required"}),
    gender: z.string().optional(),
    image: z.string().optional(),
}).refine((data) => {

    if(data.day.length !== 2 || data.month.length !== 2 || data.year.length !== 4) return false;

    const day = Number(data.day);
    const month = Number(data.month);
    const year = Number(data.year);

    // Basic checks
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if(year < 1900 || year > 2022) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    // Days in each month
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31];

    return day <= daysInMonth[month - 1];
}, {
    message: "Invalid date: Check day/month/year",
    path: ["day"],
});

type FormData = z.infer<typeof formSchema>;
const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function ProfileForm() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            bio:"",
            month:"",
            day:"",
            year:"",
            gender:"",
            image:undefined,
            }
        },
    );
    const { register, handleSubmit, watch, formState: { errors }, control } = methods;
    const imageUrl = watch("image");

    const updateContact = async (contactData: {
        bio? : string,
        mobile_no? : string,
        date_of_birth? : string,
        gender? : string,
        emergency_email? : string,
        address? : string,
        profile_pic? : string,
    }) => {
        try{
            console.log(contactData);
            const res = await fetch("/api/contact/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactData),
                }
            )
            if(!res.ok) return alert("Something went wrong");
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }


    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const date_of_birth = `${data.year}-${data.month}-${data.day}`;
        await update({
            user:{
                name: data.name,
            }
        })
        await updateUser({ name: data.name,});
        //change name
        const obj = {
            bio: data.bio || undefined,
            gender: data.gender || undefined,
            date_of_birth,
            profile_pic: data.image || undefined,
        }

        const filteredObj = Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined || value !== ""));
        const res = await updateContact(filteredObj);
        if(res) router.push("/account/profile");
        else alert("Something went wrong");
        setLoading(false);
    }

    if(!session) notFound();

    return(
        <>
            {loading
                ?
                <Spinner/>
                :
                <div className="flex justify-center px-4 flex-col">
                    <div className="text-[28px] font-medium mt-12">Basic Information</div>
                    <div className="text-sm mb-5">Make sure this information matches your travel ID, like your passport or licence</div>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block mt-5 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={style}
                                    placeholder={session?.user?.name || "John Doe"}
                                />
                                <p className="text-sm font-medium text-red-600">{errors.name?.message}</p>
                            </div>
                            <div>
                                <label className="block mt-10 font-medium">About you</label>
                                <textarea
                                    {...register("bio")}
                                    className={style}
                                    placeholder="Help us get to know you better. You can share your hobbies, interests, experiences and more."
                                />
                            </div>
                            <div>
                                <label className="block mt-10 font-medium">Date of Birth</label>
                                <div className="flex flex-row items-center gap-2">
                                    <input
                                        type="text"
                                        {...register("day")}
                                        className={style}
                                        placeholder="DD"
                                    />
                                    <input
                                        type="text"
                                        {...register("month")}
                                        className={style}
                                        placeholder="MM"
                                    />
                                    <input
                                        type="text"
                                        {...register("year")}
                                        className={style}
                                        placeholder="YYYY"
                                    />
                                </div>
                                <div className="flex">
                                    <p className="text-sm font-medium text-red-600">{errors.day?.message}</p>
                                </div>
                            </div>
                            <div className="mt-10">
                                <label className="block font-medium mb-5">Gender</label>

                                <div className="space-y-5">
                                    {[
                                        { label: "Female", value: "female" },
                                        { label: "Male", value: "male" },
                                        { label: "Other", value: "unspecified" },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center font-medium space-x-4 text-sm text-gray-900">
                                            <input
                                                type="radio"
                                                value={option.value}
                                                {...register("gender")}
                                                className="scale-150 accent-indigo-800"
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-10">
                                    <div>
                                        <label className="block font-medium">Profile Picture</label>
                                        <input
                                            type="url"
                                            {...register("image")}
                                            className={style}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-sm font-medium text-red-600">{errors.image?.message}</p>
                                    </div>
                                    {imageUrl && (
                                        <div className="rounded-full border-2 mt-5 w-40 h-40 relative overflow-hidden">
                                            <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                 src={imageUrl}  />
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm font-medium text-red-600 mt-1">{errors.gender?.message}</p>
                            </div>
                            <button type="submit" className="mt-10 w-full bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]">Save</button>
                        </form>
                    </FormProvider>
                </div>
            }
        </>
    )
}