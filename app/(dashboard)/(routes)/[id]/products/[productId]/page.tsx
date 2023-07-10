import { format } from 'date-fns';
import { type IParams } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';
import { type IProduct } from '@/app/core/interfaces';
import { ProductForm } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function ProductPage({ params }: Props): Promise<JSX.Element> {
  let formattedProduct: IProduct | null = null;
  const product = await prismaDb.product.findUnique({
    where: { id: params.productId },
    include: { images: true }
  });
  const categories = await prismaDb.category.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' }
  });
  const sizes = await prismaDb.size.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' }
  });
  const colors = await prismaDb.color.findMany({
    where: { storeId: params.id },
    orderBy: { createdAt: 'asc' }
  });

  if (product) formattedProduct = { ...product, price: parseFloat(String(product.price)) };

  return (
    <div className='flex-col flex-1 space-y-4 p-8 pt-6'>
      <ProductForm
        product={formattedProduct}
        categories={categories}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
}
export default ProductPage;
