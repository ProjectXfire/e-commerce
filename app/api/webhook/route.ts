import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { type IResponse } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';

export async function POST(req: Request): Promise<NextResponse<IResponse<any>>> {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;
    let event: Stripe.Event;
    event = stripe.webhooks.constructEvent(body, signature, process.env.WEBHOOK_SECRET!);
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session.customer_details?.address;
    const addressComponent = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country
    ];
    const addressString = addressComponent.filter((ac) => ac !== null).join(', ');
    if (event.type === 'checkout.session.completed') {
      const order = await prismaDb.order.update({
        where: { id: session.metadata?.orderId },
        data: {
          isPaid: true,
          address: addressString,
          phone: session.customer_details?.phone ?? ''
        },
        include: { orderItems: true }
      });
      const productIds = order.orderItems.map((oi) => oi.productId);
      await prismaDb.product.updateMany({
        where: { id: { in: [...productIds] } },
        data: { isArchived: true }
      });
    }
    return NextResponse.json(
      { message: null, errorMessage: 'Successful transaction', data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[STRIPE_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}
