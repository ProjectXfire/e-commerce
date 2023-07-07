import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { type ICategory } from '@/app/core/interfaces';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<ICategory | null>>> {
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
    const { name, billboardId } = body;
    if (!name || !billboardId)
      return NextResponse.json(
        { message: null, errorMessage: 'Some fields are missing', data: null },
        { status: 400 }
      );
    const store = await prismaDb.category.create({
      data: { name, billboardId, storeId }
    });
    return NextResponse.json(
      { message: 'Category created successfully', errorMessage: null, data: store },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[CATEGORY_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse<IResponse<ICategory[]>>> {
  try {
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: [] },
        { status: 400 }
      );
    const categories = await prismaDb.category.findMany({ where: { storeId } });
    return NextResponse.json(
      { message: 'List gotten successfully', errorMessage: null, data: categories },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[CATEGORIES_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: [] },
      { status: 500 }
    );
  }
}
