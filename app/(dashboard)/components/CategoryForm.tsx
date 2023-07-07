'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { upsertCategory, deleteCategory } from '../services';
import { IBillboard, ICategory } from '@/app/core/interfaces';
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
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/shared/components/ui';

interface Props {
  category: ICategory | null;
  billboards: IBillboard[];
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
});
type FormValues = z.infer<typeof formSchema>;

function CategoryForm({ category, billboards }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = category ? 'Edit category' : 'Create category';
  const description = category ? 'Edit a category' : 'Create a category';
  const action = category ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    defaultValues: category ?? { name: '', billboardId: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ name, billboardId }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await upsertCategory(params.id, {
      id: category ? category.id : undefined,
      name,
      billboardId
    });
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/categories`);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const { errorMessage, message } = await deleteCategory(params.id, params.categoryId);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/categories`);
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
        {category && (
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
                  <Input disabled={loading} placeholder='Category name' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='billboardId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
export default CategoryForm;
