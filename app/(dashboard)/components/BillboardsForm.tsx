'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { removeImage, deleteBillboard, createBillboard } from '../services';
import { useOrigin } from '@/app/shared/hooks';
import { type IBillboard } from '@/app/core/interfaces';
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
  ImageUpload,
  Input
} from '@/app/shared/components/ui';

interface Props {
  billboard: IBillboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
  imageCode: z.string().min(1)
});
type FormValues = z.infer<typeof formSchema>;

function BillboardsForm({ billboard }: Props): JSX.Element {
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = billboard ? 'Edit billboard' : 'Create billboard';
  const description = billboard ? 'Edit a billboard' : 'Create a billboard';
  const action = billboard ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    defaultValues: billboard ?? { label: '', imageUrl: '', imageCode: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ label, imageUrl, imageCode }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await createBillboard(params.id, {
      id: billboard ? billboard.id : undefined,
      label,
      imageUrl,
      imageCode
    });
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.push(`/${params.id}/billboards`);
    }
    setLoading(false);
  };

  const onRemoveImage = async (): Promise<void> => {
    const imageUrl = form.getValues().imageUrl;
    const imageCode = form.getValues().imageCode;
    if (imageUrl && imageCode) await removeImage(imageUrl, imageCode);
  };

  const onDelete = async () => {
    setLoading(true);
    const { errorMessage, message } = await deleteBillboard(params.id, params.billboardId);
    await onRemoveImage();
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.push(`/${params.id}/billboards`);
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
        {billboard && (
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
            name='label'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder='Billboard name' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={
                      field.value
                        ? [{ imageUrl: field.value, imageCode: form.getValues().imageCode }]
                        : []
                    }
                    disabled={loading}
                    onChange={async (url, code) => {
                      await onRemoveImage();
                      field.onChange(url);
                      form.setValue('imageCode', code);
                    }}
                    onRemove={async () => {
                      await onRemoveImage();
                      field.onChange('');
                      form.setValue('imageCode', '');
                    }}
                  />
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
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${billboard?.id}`}
        variant='public'
      />
    </>
  );
}
export default BillboardsForm;
