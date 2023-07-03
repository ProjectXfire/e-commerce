'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '../../hooks';
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
} from '../ui';

const formSchema = z.object({
  name: z.string().min(1)
});

function StoreModal(): JSX.Element {
  const { isOpen, onClose } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { name: '' },
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
                    <Input placeholder='E-Commerce' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit'>Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
export default StoreModal;
