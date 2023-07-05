import { Billboards } from '@/app/(dashboard)/components';

function BillboardsPage(): JSX.Element {
  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Billboards />
    </main>
  );
}
export default BillboardsPage;
