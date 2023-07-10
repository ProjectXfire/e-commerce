import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type Product, Prisma } from '@prisma/client';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function GET(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<Product | null>>> {
  try {
    const { productId } = params;
    if (!productId)
      return NextResponse.json(
        { message: null, errorMessage: 'Product ID is required', data: null },
        { status: 400 }
      );
    const product = await prismaDb.product.findUnique({
      where: { id: productId },
      include: { category: true, color: true, size: true, images: true }
    });
    return NextResponse.json(
      { message: 'Product gotten successfully', errorMessage: null, data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PRODUCT_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<null>>> {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const { storeId, productId } = params;
    if (!productId || !storeId || !productId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store, product and image ID are required', data: null },
        { status: 400 }
      );
    const body = await req.json();
    const { secure_url, public_id } = body;
    if (!secure_url || !public_id)
      return NextResponse.json(
        { message: null, errorMessage: 'Image info is missing', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    await prismaDb.image.deleteMany({ where: { productId, code: public_id, url: secure_url } });
    return NextResponse.json(
      { message: 'Image has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[IMAGE_DELETE]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { productId, storeId } = params;
    if (!productId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and product ID are required', data: null },
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
    await prismaDb.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}
        }
      }
    });
    const product = await prismaDb.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: { data: images }
        }
      }
    });
    return NextResponse.json(
      { message: 'Product updated successfully', errorMessage: null, data: product },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PRODUCT_PATCH]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<null>>> {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const { productId, storeId } = params;
    if (!productId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and product ID are required', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    await prismaDb.product.deleteMany({ where: { id: productId } });
    return NextResponse.json(
      { message: 'Product has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[PRODUCT_DELETE]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}
