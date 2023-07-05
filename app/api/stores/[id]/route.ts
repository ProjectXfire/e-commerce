import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type IResponse, type IParams } from '@/app/shared/interfaces';

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
    const body = await req.json();
    const { name } = body;
    const { id } = params;
    if (!name)
      return NextResponse.json(
        { message: null, errorMessage: 'Name is required', data: null },
        { status: 400 }
      );
    if (!id)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is required', data: null },
        { status: 400 }
      );
    await prismaDb.store.updateMany({ where: { id, userId }, data: { name } });
    return NextResponse.json(
      { message: 'Store updated successfully', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[STORES_PATCH]: ${error}`);
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
    const { id } = params;
    if (!id)
      return NextResponse.json(
        { message: null, errorMessage: 'Store ID is required', data: null },
        { status: 400 }
      );
    await prismaDb.store.deleteMany({ where: { id, userId } });
    return NextResponse.json(
      { message: 'Store has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[STORES_DELETE]: ${error}`);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2014') {
        return NextResponse.json(
          {
            message: null,
            errorMessage: 'Make sure you removed all products and categories first',
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
