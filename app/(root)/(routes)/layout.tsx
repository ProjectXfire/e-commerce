import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import prismaDb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export default async function SetupLayout({
  children
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const store = await prismaDb.store.findFirst({ where: { userId } });

  if (store) redirect(`/${store.id}`);

  return <>{children}</>;
}
