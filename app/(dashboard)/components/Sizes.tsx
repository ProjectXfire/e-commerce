'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { type ISize } from '@/app/core/interfaces';
import { ApiList, Button, DataTable, Divider, Heading } from '@/app/shared/components/ui';
import CellAction from './CellAction';

interface Props {
  sizes: ISize[];
}

export const sizeColumn: ColumnDef<ISize>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} paramKey='sizes' />
  }
];

function Billboards({ sizes }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading title={`Sizes (${sizes.length})`} description='Manage sizes for your store' />
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => router.push(`/${params.id}/sizes/new`)}
        >
          <Plus className='h-4 w-4' />
          Add new
        </Button>
      </section>
      <Divider />
      <section>
        <DataTable columns={sizeColumn} data={sizes} searchKey='name' />
      </section>
      <Divider />
      <section>
        <Heading title='API' description='API calls for sizes' />
        <Divider className='my-4' />
        <ApiList entityName='sizes' entityIdName='sizeId' />
      </section>
    </>
  );
}
export default Billboards;
