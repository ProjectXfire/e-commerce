'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useModal } from '@/app/shared/hooks';
import {
  Form,
  FormField,
  FormItem,
  Modal,
  FormLabel,
  FormControl,
  Input,
  Button,
  FormMessage
} from '@/app/shared/components/ui';
import { createStore } from '@/app/(root)/services';

const formSchema = z.object({
  name: z.string().min(1)
});

function StoreModal(): JSX.Element {
  const { isOpen, onClose } = useModal();
  const [isloading, setIsloading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { name: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsloading(true);
    const { name } = values;
    const { errorMessage, message, data } = await createStore(name);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      window.location.assign(`/${data?.id}`);
    }
    setIsloading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title='Create store'
      description='Add a new store to manage products and categories'
      onClose={onClose}
    >
      <div className='space-y-4 py-2 pb-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isloading} placeholder='E-Commerce' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button disabled={isloading} type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isloading} type='submit'>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
export default StoreModal;
