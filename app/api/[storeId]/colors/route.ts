import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { type IColor } from '@/app/core/interfaces';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<IColor | null>>> {
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
    const { name, value } = body;
    if (!name || !value)
      return NextResponse.json(
        { message: null, errorMessage: 'Some fields are missing', data: null },
        { status: 400 }
      );
    const color = await prismaDb.color.create({
      data: { name, value, storeId }
    });
    return NextResponse.json(
      { message: 'Color created successfully', errorMessage: null, data: color },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[COLOR_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse<IResponse<IColor[]>>> {
  try {
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: [] },
        { status: 400 }
      );
    const colors = await prismaDb.color.findMany({ where: { storeId } });
    return NextResponse.json(
      { message: 'List gotten successfully', errorMessage: null, data: colors },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[COLORS_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: [] },
      { status: 500 }
    );
  }
}
