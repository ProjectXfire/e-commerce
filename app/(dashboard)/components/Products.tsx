'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { type IProduct } from '@/app/core/interfaces';
import { ApiList, Button, DataTable, Divider, Heading } from '@/app/shared/components/ui';
import CellAction from './CellAction';

interface Props {
  products: IProduct[];
}

export const productColumn: ColumnDef<IProduct>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'size', header: 'Size' },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.color}
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    )
  },
  { accessorKey: 'isFeatured', header: 'Is featured?' },
  { accessorKey: 'isArchived', header: 'Is archived?' },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} paramKey='products' />
  }
];

function Products({ products }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading
          title={`Products (${products.length})`}
          description='Manage products for your store'
        />
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => router.push(`/${params.id}/products/new`)}
        >
          <Plus className='h-4 w-4' />
          Add new
        </Button>
      </section>
      <Divider />
      <section>
        <DataTable columns={productColumn} data={products} searchKey='name' />
      </section>
      <Divider />
      <section>
        <Heading title='API' description='API calls for products' />
        <Divider className='my-4' />
        <ApiList entityName='products' entityIdName='productId' />
      </section>
    </>
  );
}
export default Products;
