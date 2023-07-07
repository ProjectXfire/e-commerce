'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteSize, upsertSize } from '../services';
import { type ISize } from '@/app/core/interfaces';
import {
  AlertModal,
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
  size: ISize | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
});
type FormValues = z.infer<typeof formSchema>;

function SizeForm({ size }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = size ? 'Edit size' : 'Create size';
  const description = size ? 'Edit a size' : 'Create a size';
  const action = size ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    defaultValues: size ?? { name: '', value: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ name, value }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await upsertSize(params.id, {
      id: size ? size.id : undefined,
      name,
      value
    });
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/sizes`);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const { errorMessage, message } = await deleteSize(params.id, params.sizeId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/sizes`);
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
        <Heading title={title} description={description} />
        {size && (
          <Button variant='destructive' size='sm' disabled={loading} onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Divider />
      <Form {...form}>
        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Size name' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='value'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Size value' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className='ml-auto' type='submit' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
      <Divider />
    </>
  );
}
export default SizeForm;
