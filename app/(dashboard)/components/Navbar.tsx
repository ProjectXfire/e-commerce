import { redirect } from 'next/navigation';
import { UserButton, auth } from '@clerk/nextjs';
import prismaDb from '@/lib/prismadb';
import MainNavbar from './MainNavbar';
import Switcher from './Switcher';

async function Navbar(): Promise<JSX.Element> {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const stores = await prismaDb.store.findMany({ where: { userId } });

  return (
    <nav className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <Switcher items={stores} />
        <MainNavbar className='mx-6' />
        <div className='ml-auto flex items-center space-x-4'>
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
