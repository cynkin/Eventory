// import Razorpay from 'razorpay';
// import { NextRequest, NextResponse} from "next/server";
//
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID!,
//     key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });
//
// export async function POST(req: NextRequest,) {
//     const body = await req.json();
//     const { amount } = body;
//
//     const options = {
//         amount: amount * 100, // ₹500 = 50000 paise
//         currency: 'INR',
//         receipt: `order_rcptid_${Math.random().toString().slice(2, 10)}`
//     };
//
//     try {
//         const order = await razorpay.orders.create(options);
//         return NextResponse.json(order);
//     } catch (err:any) {
//         return NextResponse.json({ error: err.message ?? 'Order creation failed' }, { status: 500 });    }
// }