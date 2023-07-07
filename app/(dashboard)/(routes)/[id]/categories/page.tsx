import { format } from 'date-fns';
import { type IParams } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';
import { Categories } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function CategoriesPage({ params }: Props): Promise<JSX.Element> {
  const categories = await prismaDb.category.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' },
    include: { billboard: true }
  });

  const formattedCategories = categories.map((item) => ({
    ...item,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMM do, yyyy')
  }));

  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Categories categories={formattedCategories} />
    </main>
  );
}
export default CategoriesPage;
