import prismaDb from '@/lib/prismadb';
import { CategoryForm } from '@/app/(dashboard)/components';
import { IParams } from '@/app/shared/interfaces';

interface Props {
  params: IParams;
}

async function CategoryPage({ params }: Props): Promise<JSX.Element> {
  const category = await prismaDb.category.findUnique({ where: { id: params.categoryId } });
  const billboards = await prismaDb.billboard.findMany({ where: { storeId: params.id } });

  return (
    <div className='flex-col flex-1 space-y-4 p-8 pt-6'>
      <CategoryForm category={category} billboards={billboards} />
    </div>
  );
}
export default CategoryPage;
