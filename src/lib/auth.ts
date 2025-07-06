import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { comparePassword } from "@/utils/hash";
import prisma from "@/lib/db";
import { JWT } from "next-auth/jwt";
import {User, Session, SessionStrategy, Account, Profile} from "next-auth";


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

                if(!user || !credentials?.password) return null;

                const isValid = await comparePassword(credentials.password, user.password!);
                if(!isValid) return null;

                return{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    balance: user.balance ? Number(user.balance) : 0,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
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
                      account,
                      profile,
                      session} :
                  {token:JWT;
                      user?:User;
                      trigger?:"update";
                      session?:Session;
                      account?: Account;
                      profile?: Profile;
                  }){

            if (user && account?.provider === "google") {
                const existingUser = await prisma.users.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    const newUser = await prisma.users.create({
                        data: {
                            email: user.email!,
                            name: user.name,
                            role: "user", // Default role
                            balance: 1000,
                            google_id: account.providerAccountId,
                        },

                    });

                    await prisma.contact.upsert({
                        where:{id: newUser.id},
                        update:{profile_pic : user.image},
                        create:{
                            id: newUser.id,
                            profile_pic: user.image,
                        }
                    })

                    token.id = newUser.id;
                    token.role = newUser.role;
                    token.balance = Number(newUser.balance);
                    token.name = newUser.name!;
                    token.email = newUser.email!;
                } else {
                    token.id = existingUser.id;
                    token.role = existingUser.role;
                    token.balance = Number(existingUser.balance);
                    token.name = existingUser.name!;
                    token.email = existingUser.email!;
                }
            }

            else if(user){
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
            }
            return session;
        },
    },
    secret : process.env["NEXTAUTH_SECRET"],

};