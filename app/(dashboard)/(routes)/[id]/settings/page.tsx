import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import { type IParams } from '@/app/shared/interfaces';
import { SettingsForm } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function SettingsPage({ params }: Props): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const store = await prismaDb.store.findFirst({ where: { userId, id: params.id } });

  if (!store) redirect('/');

  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm store={store} />
      </div>
    </section>
  );
}
export default SettingsPage;
