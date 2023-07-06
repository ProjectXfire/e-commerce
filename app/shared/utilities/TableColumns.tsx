import { type ColumnDef } from '@tanstack/react-table';
import { type IBillboard } from '@/app/core/interfaces';
import { CellAction } from '../components/ui';

export const billboardColumn: ColumnDef<IBillboard>[] = [
  {
    accessorKey: 'label',
    header: 'Label'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
