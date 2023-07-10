import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type Size, Prisma } from '@prisma/client';
import { type IParams, type IResponse } from '@/app/shared/interfaces';

export async function GET(
  req: Request,
  { params }: { params: IParams }
): Promise<NextResponse<IResponse<Size | null>>> {
  try {
    const { sizeId } = params;
    if (!sizeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Size ID is required', data: null },
        { status: 400 }
      );
    const size = await prismaDb.size.findUnique({ where: { id: sizeId } });
    return NextResponse.json(
      { message: 'Size gotten successfully', errorMessage: null, data: size },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[SIZE_GET]: ${error}`);
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
    const { sizeId, storeId } = params;
    if (!sizeId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and size ID are required', data: null },
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
    await prismaDb.size.updateMany({
      where: { id: sizeId },
      data: { name, value }
    });
    return NextResponse.json(
      { message: 'Size updated successfully', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[SIZE_PATCH]: ${error}`);
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
    const { sizeId, storeId } = params;
    if (!sizeId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and size ID are required', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    await prismaDb.size.deleteMany({ where: { id: sizeId } });
    return NextResponse.json(
      { message: 'Size has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[SIZE_DELETE]: ${error}`);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2014') {
        return NextResponse.json(
          {
            message: null,
            errorMessage: 'Make sure you removed all products using this size first',
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
