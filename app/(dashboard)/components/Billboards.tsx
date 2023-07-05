'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button, Divider, Heading } from '@/app/shared/components/ui';

function Billboards(): JSX.Element {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <section className='flex items-center justify-between'>
        <Heading title='Billboards (0)' description='Manage billboards for your store' />
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
      <section></section>
    </>
  );
}
export default Billboards;
