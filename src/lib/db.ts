import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default prisma;

// import {Pool} from "pg"
//
// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     database: process.env.DB
// })
//
// export default pool