import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type Category, Prisma } from '@prisma/client';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function GET(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<Category | null>>> {
  try {
    const { categoryId } = params;
    if (!categoryId)
      return NextResponse.json(
        { message: null, errorMessage: 'Category ID is required', data: null },
        { status: 400 }
      );
    const category = await prismaDb.category.findUnique({ where: { id: categoryId } });
    return NextResponse.json(
      { message: 'Category gotten successfully', errorMessage: null, data: category },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[CATEGORY_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { categoryId, storeId } = params;
    if (!categoryId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and category ID are required', data: null },
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
    await prismaDb.category.updateMany({
      where: { id: categoryId },
      data: { name, billboardId }
    });
    return NextResponse.json(
      { message: 'Category updated successfully', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[CATEGORY_PATCH]: ${error}`);
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
    const { categoryId, storeId } = params;
    if (!categoryId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and category ID are required', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    await prismaDb.category.deleteMany({ where: { id: categoryId } });
    return NextResponse.json(
      { message: 'Category has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[CATEGORY_DELETE]: ${error}`);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2014') {
        return NextResponse.json(
          {
            message: null,
            errorMessage: 'Make sure you removed all categories from products first',
            data: null
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}
