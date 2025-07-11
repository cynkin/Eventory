import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/utils/hash";
import prisma from "@/lib/db";
import { JWT } from "next-auth/jwt";
import { decodeJwt } from "@/lib/decodeJwt";
import {User, Session, SessionStrategy, Account, Profile} from "next-auth";
import {NextRequest} from "next/server";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials :{
                email : {label : "Email", type: "email"},
                password: {label : "Password", type: "password"},
            },
            async authorize(credentials){
                const user = await prisma.users.findUnique({
                    where : {email : credentials?.email},
                });

                let google = false;
                if(credentials?.password === 'google') {
                    google = true;
                }else{
                    if(!user || !credentials?.password) return null;

                    const isValid = await comparePassword(credentials.password, user.password!);
                    if(!isValid) return null;
                }

                if(!user) {
                    const newUser = await prisma.users.create({
                        data:{
                            email: credentials?.email,
                            name: 'google',
                            role: "user",
                            balance: 1000,
                            google_id: google ? credentials?.email : undefined,
                        }
                    })
                    return{
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        balance: newUser.balance ? Number(newUser.balance) : 0,
                        google: google,
                    };
                }
                return{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    balance: user.balance ? Number(user.balance) : 0,
                    google: google,
                };
            },
        }),
    ],
    pages: {
        signIn : "/login/email",
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    callbacks:{
        async jwt({token,
                      user,
                      trigger,
                      session} :
                  {token:JWT;
                      user?:User;
                      trigger?: "update" | "create";
                      session?:Session;
                  },){

            //
            // if (!token.id && req?.cookies?.get("auth_token")) {
            //     const raw = req.cookies.get("auth_token")?.value;
            //     if (raw) {
            //         try {
            //             const decoded = decodeJwt(raw);
            //             console.log("Decoded JWT:", decoded);
            //
            //             token.id = decoded.id;
            //             token.name = decoded.name;
            //             token.email = decoded.email;
            //             token.role = decoded.role;
            //             token.balance = decoded.balance;
            //             token.isNewUser = false;
            //         } catch (err) {
            //             console.error("Invalid auth_token:", err);
            //         }
            //     } else {
            //         console.warn("auth_token cookie not found in request");
            //     }
            // }



            // if (user && account?.provider === "google") {
            //     const existingUser = await prisma.users.findUnique({
            //         where: { email: user.email! },
            //     });
            //
            //     if (!existingUser) {
            //         const newUser = await prisma.users.create({
            //             data: {
            //                 email: user.email!,
            //                 name: user.name,
            //                 role: "user",
            //                 balance: 1000,
            //                 google_id: account.providerAccountId,
            //             },
            //
            //         });
            //
            //         // await prisma.contact.upsert({
            //         //     where:{id: newUser.id},
            //         //     update:{profile_pic : user.image},
            //         //     create:{
            //         //         id: newUser.id,
            //         //         profile_pic: user.image,
            //         //     }
            //         // })
            //
            //         token.id = newUser.id;
            //         token.role = newUser.role;
            //         token.balance = Number(newUser.balance);
            //         token.name = newUser.name!;
            //         token.email = newUser.email!;
            //         token.isNewUser = true;
            //     } else {
            //         token.id = existingUser.id;
            //         token.role = existingUser.role;
            //         token.balance = Number(existingUser.balance);
            //         token.name = existingUser.name!;
            //         token.email = existingUser.email!;
            //         token.isNewUser = false;
            //     }
            // }

            if(user){
                token.id = user.id ?? token.sub;
                token.balance = user.balance;
                token.role = user.role ?? "user";
                token.email = user.email!;
                token.name = user.name ?? undefined;
            }

            if(trigger === "update" && session){
                if (session.user?.name) token.name = session.user.name;
                if (session.user?.email) token.email = session.user.email;
                if (session.user?.role) token.role = session.user.role;
                if (session.user?.balance !== undefined) token.balance = session.user.balance;
            }

            if (!token.id && token.sub) {
                token.id = token.sub;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }){
            if(token && session.user){
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
                session.user.balance = token.balance;
                session.user.email = token.email;
                session.user.isNew = token.isNewUser || false;
            }
            return session;
        },
    },
    secret : process.env["NEXTAUTH_SECRET"],

};