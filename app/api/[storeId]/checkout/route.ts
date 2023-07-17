import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prismaDb from '@/lib/prismadb';
import { IResponse, type IParams } from '@/app/shared/interfaces';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<string | null>>> {
  try {
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: null },
        { status: 400 }
      );

    const { productIds } = await req.json();
    if (!productIds || productIds.length === 0)
      return NextResponse.json(
        { message: null, errorMessage: 'No products in cart', data: null },
        { status: 400 }
      );
    const products = await prismaDb.product.findMany({ where: { id: { in: productIds } } });
    if (products.length === 0)
      return NextResponse.json(
        { message: null, errorMessage: 'No products found', data: null },
        { status: 400 }
      );
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: product.name
          },
          unit_amount: product.price.toNumber() * 100
        }
      });
    });
    const order = await prismaDb.order.create({
      data: {
        storeId,
        isPaid: false,
        orderItems: { create: productIds.map((id: string) => ({ product: { connect: { id } } })) }
      }
    });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id
      }
    });
    return NextResponse.json(
      { message: 'Successful transaction', errorMessage: null, data: session.url },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`[CHECKOUT_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500, headers: corsHeaders }
    );
  }
}
