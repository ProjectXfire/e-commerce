'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { type IBillboard } from '@/app/core/interfaces';
import { billboardColumn } from '@/app/shared/utilities';
import { ApiList, Button, DataTable, Divider, Heading } from '@/app/shared/components/ui';

interface Props {
  billboards: IBillboard[];
}

function Billboards({ billboards }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${billboards.length})`}
          description='Manage billboards for your store'
        />
        <Button
          type='button'
          className='flex gap-2'
          onClick={() => router.push(`/${params.id}/billboards/new`)}
        >
          <Plus className='h-4 w-4' />
          Add new
        </Button>
      </section>
      <Divider />
      <section>
        <DataTable columns={billboardColumn} data={billboards} searchKey='label' />
      </section>
      <Divider />
      <section>
        <Heading title='API' description='API calls for billboards' />
        <Divider className='my-4' />
        <ApiList entityName='billboards' entityIdName='billboardId' />
      </section>
    </>
  );
}
export default Billboards;
