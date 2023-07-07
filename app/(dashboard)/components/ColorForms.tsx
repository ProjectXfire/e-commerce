'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteColor, upsertColor } from '../services';
import { type IColor } from '@/app/core/interfaces';
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
  color: IColor | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).max(7).regex(/^#/, { message: 'Value must be a valid hex code' })
});
type FormValues = z.infer<typeof formSchema>;

function ColorForm({ color }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = color ? 'Edit color' : 'Create color';
  const description = color ? 'Edit a color' : 'Create a color';
  const action = color ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    defaultValues: color ?? { name: '', value: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ name, value }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await upsertColor(params.id, {
      id: color ? color.id : undefined,
      name,
      value
    });
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/colors`);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const { errorMessage, message } = await deleteColor(params.id, params.colorId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/colors`);
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
        {color && (
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
                  <Input disabled={loading} placeholder='Ex. #000000' {...field} />
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
export default ColorForm;
