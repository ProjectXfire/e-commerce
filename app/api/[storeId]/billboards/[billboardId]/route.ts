import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type IResponse } from '@/app/shared/interfaces';
import { type IBillboard } from '@/app/core/interfaces';

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
): Promise<NextResponse<IResponse<IBillboard | null>>> {
  try {
    const { billboardId } = params;
    if (!billboardId)
      return NextResponse.json(
        { message: null, errorMessage: 'Billboard ID is required', data: null },
        { status: 400 }
      );
    const billboard = await prismaDb.billboard.findUnique({ where: { id: billboardId } });
    return NextResponse.json(
      { message: 'Billboard has been successfully deleted', errorMessage: null, data: billboard },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[BILLBOARD_GET]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
): Promise<NextResponse<IResponse<null>>> {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const { billboardId, storeId } = params;
    if (!billboardId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and billboard ID are required', data: null },
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
    await prismaDb.billboard.updateMany({
      where: { id: billboardId },
      data: { label, imageCode, imageUrl }
    });
    return NextResponse.json(
      { message: 'Billboard updated successfully', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[BILLBOARD_PATCH]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
): Promise<NextResponse<IResponse<null>>> {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const { billboardId, storeId } = params;
    if (!billboardId || !storeId)
      return NextResponse.json(
        { message: null, errorMessage: 'Store and billboard ID are required', data: null },
        { status: 400 }
      );
    const isStoreFromUser = await prismaDb.store.findFirst({ where: { userId, id: storeId } });
    if (!isStoreFromUser)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized store', data: null },
        { status: 400 }
      );
    await prismaDb.billboard.deleteMany({ where: { id: billboardId } });
    return NextResponse.json(
      { message: 'Billboard has been successfully deleted', errorMessage: null, data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[BILLBOARD_DELETE]: ${error}`);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2014') {
        return NextResponse.json(
          {
            message: null,
            errorMessage: 'Make sure you removed all products from billboard first',
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
