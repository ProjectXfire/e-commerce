import { format } from 'date-fns';
import prismaDb from '@/lib/prismadb';
import { type IParams } from '@/app/shared/interfaces';
import { currencyFormatter } from '@/app/shared/utils';
import { Orders } from '@/app/(dashboard)/components';

interface Props {
  params: IParams;
}

async function OrdersPage({ params }: Props): Promise<JSX.Element> {
  const orders = await prismaDb.order.findMany({
    where: { storeId: params.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'asc' }
  });

  const formattedOrders = orders.map((item) => ({
    ...item,
    orderItems: item.orderItems.map((oi) => oi.product.name).join(','),
    totalPrice: currencyFormatter.format(
      item.orderItems.reduce((acc, cv) => {
        return acc + Number(cv.product.price);
      }, 0)
    ),
    createdAt: format(item.createdAt, 'MMM do, yyyy'),
    updatedAt: format(item.createdAt, 'MMM do, yyyy')
  }));

  return (
    <main className='flex-col flex-1 space-y-4 p-8 pt-6 flex-wrap'>
      <Orders orders={formattedOrders} />
    </main>
  );
}
export default OrdersPage;
