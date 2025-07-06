import { z } from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import {notFound, useRouter} from "next/navigation";

const formSchema = z.object({
    phone: z
        .string()
        .length(10, "Phone number must be 10 digits")
        .regex(/^\d+$/, "Phone number must be numeric"),

    address: z
        .string({required_error:"This field is required"})
        .min(2, "Address must be at least 2 characters"),

    city: z
        .string({required_error:"This field is required"})
        .min(2, "City must be at least 2 characters")
        .max(30, "City must be at most 30 characters"),

    state: z
        .string({required_error:"This field is required"})
        .min(2, "State name must be at least 2 characters")
        .max(30, "State name must be at most 30 characters"),

    postcode: z
        .string({required_error:"This field is required"})
        .length(6, "Postcode must be 6 digits")
        .regex(/^\d{6}$/, "Postcode must contain only digits"),
});

type FormData = z.infer<typeof formSchema>;
const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-3 px-3 mt-1 rounded-xl"

export default function ContactForm() {
    const router = useRouter();
    const { data: session, status} = useSession();

    const methods = useForm<FormData>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                phone:"",
                address:"",
                city: "",
                state: "",
                postcode: "",
            }
        },
    );
    const { register, handleSubmit, formState: { errors }, control } = methods;

    const updateContact = async (contactData: {
        mobile_no? : string,
        emergency_email? : string,
        address? : string,
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
        console.log(data);

        const address = `${data.address}, ${data.city}, ${data.state}, ${data.postcode}`;

        const res = await updateContact({mobile_no: data.phone, address})
        if(res) router.push("/account/profile");
        else alert("Something went wrong");
    }

    if(status === "loading") return(<Spinner/>)
    if(!session) notFound();

    return(
        <div className="flex w-[600px] flex-col">
            <div className="text-[28px] font-medium mt-12">Contact</div>
            <div className="text-sm mb-5"></div>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block mt-5 font-medium">Mobile Number</label>
                        <input
                            type="text"
                            {...register("phone")}
                            className={style}
                            placeholder="Phone number"
                        />
                        <p className="text-sm font-medium mt-1 text-red-600">{errors.phone?.message}</p>
                    </div>
                    <div>
                        <label className="block mt-7 font-medium">Email</label>
                        <div className="mt-1 ml-0.5 text-sm">{session.user.email}</div>
                        <div className="mt-1 ml-0.5 text-sm">You can change your email in the settings</div>
                    </div>
                    <div>
                        <label className="block mt-7 font-medium">Address</label>
                        <div className="flex flex-col gap-2.5">
                        <input
                            type="text"
                            {...register("address")}
                            className={style}
                            placeholder="Address"
                        />
                        <input
                            type="text"
                            {...register("city")}
                            className={style}
                            placeholder="City"
                        />
                        <input
                            type="text"
                            {...register("state")}
                            className={style}
                            placeholder="State"
                        />
                        <input
                            type="text"
                            {...register("postcode")}
                            className={style}
                            placeholder="Postcode"
                        />
                        </div>
                        <p className="text-sm mt-1 font-medium text-red-600">{errors.address?.message}</p>
                        <p className="text-sm font-medium text-red-600">{errors.city?.message}</p>
                        <p className="text-sm font-medium text-red-600">{errors.state?.message}</p>
                        <p className="text-sm font-medium text-red-600">{errors.postcode?.message}</p>
                    </div>


                    <button type="submit" className="mt-10 w-full bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]">Save</button>
                </form>
            </FormProvider>

        </div>
    )
}