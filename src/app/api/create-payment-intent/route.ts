// pages/api/create-payment-intent.ts or app/api/create-payment-intent/route.ts (Next.js 13+)
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // or latest
});

export async function POST(req: Request) {
  const { amount } = await req.json(); // amount in cents (e.g. $10 = 1000)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch {
    return new Response(JSON.stringify({ error: "Payment failed" }), { status: 500 });
  }
}
