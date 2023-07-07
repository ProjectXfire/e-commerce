'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { type ICategory } from '@/app/core/interfaces';
import { ApiList, Button, DataTable, Divider, Heading } from '@/app/shared/components/ui';
import CategoryCellAction from './CategoryCellAction';

interface Props {
  categories: ICategory[];
}

export const categoryColumn: ColumnDef<ICategory>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
    cell: ({ row }) => row.original.billboardLabel
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CategoryCellAction data={row.original} />
  }
];

function Categories({ categories }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading
          title={`Categories (${categories.length})`}
          description='Manage categories for your store'
        />
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => router.push(`/${params.id}/categories/new`)}
        >
          <Plus className='h-4 w-4' />
          Add new
        </Button>
      </section>
      <Divider />
      <section>
        <DataTable columns={categoryColumn} data={categories} searchKey='name' />
      </section>
      <Divider />
      <section>
        <Heading title='API' description='API calls for categories' />
        <Divider className='my-4' />
        <ApiList entityName='categories' entityIdName='categoryId' />
      </section>
    </>
  );
}
export default Categories;
