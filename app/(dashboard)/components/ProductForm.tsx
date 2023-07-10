'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { upsertProduct, deleteProduct, removeImageFromProduct } from '../services';
import { ICategory, ISize, type IProduct, IColor } from '@/app/core/interfaces';
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
  ImageUpload,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  FormDescription
} from '@/app/shared/components/ui';

interface Props {
  product: IProduct | null;
  categories: ICategory[];
  sizes: ISize[];
  colors: IColor[];
}

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  images: z.object({ url: z.string().min(1), code: z.string().min(1) }).array()
});
type FormValues = z.infer<typeof formSchema>;

function ProductForm({ product, categories, sizes, colors }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = product ? 'Edit product' : 'Create product';
  const description = product ? 'Edit a product' : 'Create a product';
  const action = product ? 'Save changes' : 'Create';

  const form = useForm<FormValues>({
    defaultValues: product ?? {
      name: '',
      price: 0,
      categoryId: '',
      sizeId: '',
      colorId: '',
      isFeatured: false,
      isArchived: false,
      images: []
    },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({
    name,
    price,
    categoryId,
    colorId,
    sizeId,
    isArchived,
    isFeatured,
    images
  }: FormValues): Promise<void> => {
    setLoading(true);
    const { errorMessage, message } = await upsertProduct(params.id, {
      id: product ? product.id : undefined,
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isArchived,
      isFeatured,
      images
    });
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
      router.push(`/${params.id}/products`);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    const images = form
      .getValues()
      .images.map((img) => ({ secure_url: img.url, public_id: img.code }));
    const { errorMessage, message } = await deleteProduct(params.id, params.productId, images);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.push(`/${params.id}/products`);
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
        {product && (
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
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    values={field.value.map((img) => ({
                      imageCode: img.code,
                      imageUrl: img.url
                    }))}
                    disabled={loading}
                    onChange={async (url, code) => {
                      field.onChange([...field.value, { code, url }]);
                    }}
                    onRemove={async (url, code) => {
                      await removeImageFromProduct(params.id, params.productId, url, code);
                      const updatedImages = field.value.filter((img) => img.code !== code);
                      field.onChange(updatedImages);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Product name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      disabled={loading}
                      placeholder='Product price'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sizeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a sizes' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='colorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a color' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem className='flex items-center gap-x-2' key={c.id} value={c.id}>
                          <div className='flex items-center gap-x-2'>
                            <div
                              className='h-6 w-6 rounded-full border'
                              style={{ backgroundColor: c.value }}
                            />
                            {c.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the home page.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isArchived'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button className='ml-auto' type='submit' disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
      <Divider />
    </>
  );
}
export default ProductForm;
