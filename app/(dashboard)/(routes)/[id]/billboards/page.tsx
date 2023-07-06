import { format } from 'date-fns';
import { type IParams } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';
import { Billboards } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function BillboardsPage({ params }: Props): Promise<JSX.Element> {
  const billboards = await prismaDb.billboard.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' }
  });

  const formattedBillboards = billboards.map((item) => ({
    ...item,
    createdAt: format(item.createdAt, 'MMM do, yyyy')
  }));

  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Billboards billboards={formattedBillboards} />
    </main>
  );
}
export default BillboardsPage;
