'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { type IColor } from '@/app/core/interfaces';
import { ApiList, Button, DataTable, Divider, Heading } from '@/app/shared/components/ui';
import CellAction from './CellAction';

interface Props {
  sizes: IColor[];
}

export const sizeColumn: ColumnDef<IColor>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className='flex items-center gap-x-2'>
        {row.original.value}
        <div
          className='h-6 w-6 rounded-full border'
          style={{ backgroundColor: row.original.value }}
        ></div>
      </div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} paramKey='colors' />
  }
];

function Billboards({ sizes }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading title={`Colors (${sizes.length})`} description='Manage colors for your store' />
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => router.push(`/${params.id}/colors/new`)}
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
        <Heading title='API' description='API calls for colors' />
        <Divider className='my-4' />
        <ApiList entityName='colors' entityIdName='colorId' />
      </section>
    </>
  );
}
export default Billboards;
