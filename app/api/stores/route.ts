import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { IStore } from '@/app/(root)/models';

interface ReturnStore<T> {
  message: string | null;
  errorMessage: string | null;
  data: T;
}

export async function POST(req: Request): Promise<NextResponse<ReturnStore<IStore | null>>> {
  console.log('entra el post');
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json(
        { message: null, errorMessage: 'Unauthorized', data: null },
        { status: 401 }
      );
    const body = await req.json();
    const { name } = body;
    if (!name)
      return NextResponse.json(
        { message: null, errorMessage: 'Name is required', data: null },
        { status: 400 }
      );
    const store = await prismaDb.store.create({ data: { name, userId } });
    return NextResponse.json(
      { message: 'Store created successfully', errorMessage: null, data: store },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`[STORES_POST]: ${error}`);
    return NextResponse.json(
      { message: null, errorMessage: 'Something get wrong!', data: null },
      { status: 500 }
    );
  }
}
