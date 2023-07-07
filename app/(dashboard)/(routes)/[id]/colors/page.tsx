import { format } from 'date-fns';
import { type IParams } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';
import { Colors } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function SizesPage({ params }: Props): Promise<JSX.Element> {
  const colors = await prismaDb.color.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' }
  });

  const formattedSizes = colors.map((item) => ({
    ...item,
    createdAt: format(item.createdAt, 'MMM do, yyyy')
  }));

  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Colors sizes={formattedSizes} />
    </main>
  );
}
export default SizesPage;
