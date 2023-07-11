'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type IOrder } from '@/app/core/interfaces';
import { DataTable, Divider, Heading } from '@/app/shared/components/ui';

interface Props {
  orders: IOrder[];
}

export const billboardColumn: ColumnDef<IOrder>[] = [
  {
    accessorKey: 'orderItems',
    header: 'Products'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price'
  },
  {
    accessorKey: 'isPaid',
    header: 'Is Paid?'
  }
];

function Orders({ orders }: Props): JSX.Element {
  return (
    <>
      <section>
        <Heading title={`Orders (${orders.length})`} description='Manage orders for your store' />
      </section>
      <Divider />
      <section>
        <DataTable columns={billboardColumn} data={orders} searchKey='address' />
      </section>
      <Divider />
    </>
  );
}
export default Orders;
