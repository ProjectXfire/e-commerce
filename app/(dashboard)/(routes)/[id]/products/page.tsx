import { format } from 'date-fns';
import prismaDb from '@/lib/prismadb';
import { type IParams } from '@/app/shared/interfaces';
import { currencyFormatter } from '@/app/shared/utils';
import { Products } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function ProductsPage({ params }: Props): Promise<JSX.Element> {
  const products = await prismaDb.product.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' },
    include: { category: true, color: true, size: true, images: true }
  });

  const formattedProducts = products.map((item) => ({
    ...item,
    price: parseFloat(String(item.price)),
    category: item.category.name,
    color: item.color.value,
    size: item.size.name,
    createdAt: format(item.createdAt, 'MMM do, yyyy'),
    updatedAt: format(item.updateAt, 'MMM do, yyyy')
  }));

  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Products products={formattedProducts} />
    </main>
  );
}
export default ProductsPage;
