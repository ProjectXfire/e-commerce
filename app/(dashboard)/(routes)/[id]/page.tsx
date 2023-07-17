import { CreditCard, DollarSign, Package } from 'lucide-react';
import { type IParams } from '@/app/shared/interfaces';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Divider,
  Heading
} from '@/app/shared/components/ui';
import { getGraphRevenue, getSalesCount, getStockCount, getTotalRevenue } from '@/actions';
import { currencyFormatter } from '@/app/shared/utils';
import { Overview } from '../../components';

interface Props {
  params: IParams;
}

async function DashboardPage({ params }: Props): Promise<JSX.Element> {
  if (!params.id) return <></>;

  const { data: totalRevenue } = await getTotalRevenue(params.id);
  const { data: salesCount } = await getSalesCount(params.id);
  const { data: stockCount } = await getStockCount(params.id);
  const { data: graphData } = await getGraphRevenue(params.id);

  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Dashboard' description='Overview of your store' />
        <Divider />
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2 flex flex-row items-center space-y-0 justify-between'>
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {currencyFormatter.format(totalRevenue ?? 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2 flex flex-row items-center space-y-0 justify-between'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+{salesCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2 flex flex-row items-center space-y-0 justify-between'>
              <CardTitle className='text-sm font-medium'>Products in stock</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stockCount ?? 0}</div>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={graphData} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
export default DashboardPage;
