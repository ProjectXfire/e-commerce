import { NextResponse } from 'next/server';
import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { type Product } from '@prisma/client';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<Product | null>>> {
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
    const { name, price, categoryId, colorId, sizeId, isArchived, isFeatured, images } = body;
    if (
      !name ||
      price === undefined ||
      !categoryId ||
      !colorId ||
      !sizeId ||
      isArchived === undefined ||
      isFeatured === undefined ||
      (!images && images.length === 0)
    )
      return NextResponse.json(
        { message: null, errorMessage: 'Some fields are missing', data: null },
        { status: 400 }
      );
    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        storeId,
        isArchived,
        isFeatured,
        images: {
          createMany: { data: images }
        }
      }
    });
    return NextResponse.json(
      { message: 'Product created successfully', errorMessage: null, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[PRODUCT_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
): Promise<NextResponse<IResponse<Product[]>>> {
  try {
    const { storeId } = params;
    if (!storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is missing', data: [] },
        { status: 400 }
      );
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const products = await prismaDb.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        color: true,
        category: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(
      { message: 'List gotten successfully', errorMessage: null, data: products },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[PRODUCTS_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: [] },
      { status: 500 }
    );
  }
}
