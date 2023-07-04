import { type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { Navbar } from '../../components';

interface IParams {
  id: string;
}

interface Props {
  children: ReactNode;
  params: IParams;
}

export default async function DashboardLayout({ children, params }: Props): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const store = await prismaDb.store.findFirst({ where: { id: params.id, userId } });

  if (!store) redirect('/');

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
