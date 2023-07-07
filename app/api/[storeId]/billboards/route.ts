import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { type IBillboard } from '@/app/core/interfaces';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<IBillboard | null>>> {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    const body = await req.json();
    const { label, imageUrl, imageCode } = body;
    if (!label || !imageUrl || !imageCode)
      return NextResponse.json(
        { message: null, errorMessage: 'Some fields are missing', data: null },
        { status: 400 }
      );
    const billboard = await prismaDb.billboard.create({
      data: { imageCode, imageUrl, label, storeId }
    });
    return NextResponse.json(
      { message: 'Billboard created successfully', errorMessage: null, data: billboard },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[BILLBOARDS_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse<IResponse<IBillboard[]>>> {
  try {
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: [] },
        { status: 400 }
      );
    const billboards = await prismaDb.billboard.findMany({ where: { storeId } });
    return NextResponse.json(
      { message: 'List gotten successfully', errorMessage: null, data: billboards },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[BILLBOARDS_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: [] },
      { status: 500 }
    );
  }
}
