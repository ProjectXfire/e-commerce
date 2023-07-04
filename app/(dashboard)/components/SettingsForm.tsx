'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteStore, updateStore } from '../services';
import { useOrigin } from '@/app/shared/hooks';
import { type IStore } from '@/app/core/interfaces';
import {
  AlertModal,
  ApiAlert,
  Button,
  Divider,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Heading,
  Input
} from '@/app/shared/components/ui';

interface Props {
  store: IStore;
}

const formSchema = z.object({ name: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

function SettingsForm({ store }: Props): JSX.Element {
  const form = useForm<FormValues>({
    defaultValues: { name: '' },
    resolver: zodResolver(formSchema)
  });
  const origin = useOrigin();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async ({ name }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await updateStore(store.id, name);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push('/');
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const { errorMessage, message } = await deleteStore(store.id);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button variant='destructive' size='sm' disabled={loading} onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Divider />
      <Form {...form}>
        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Store name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button className='ml-auto' type='submit' disabled={loading}>
            Save changes
          </Button>
        </form>
      </Form>
      <Divider />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${store.id}`}
        variant='public'
      />
    </>
  );
}
export default SettingsForm;
