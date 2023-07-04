'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Store, ChevronsUpDown, Check, PlusCircle } from 'lucide-react';
import { IStore } from '@/app/core/interfaces';
import { cn } from '@/lib/utils';
import { useModal } from '@/app/shared/hooks';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/shared/components/ui';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
  items: IStore[];
}

function Switcher({ items = [], className }: Props): JSX.Element {
  const storeModal = useModal();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedItems = items.map((i) => ({ label: i.name, value: i.id }));
  const currentStore = formattedItems.find((i) => i.value === params.id);

  const onStoreSelect = (value: string): void => {
    setOpen(false);
    router.push(`/${value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn('w-[200px] justify-between', className)}
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a store'
        >
          <Store className='mr-2 h-4 w-4' />
          {currentStore?.label}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map(({ label, value }) => (
                <CommandItem className='text-sm' key={value} onSelect={() => onStoreSelect(value)}>
                  <Store className='mr-2 h-4 w-4' />
                  {label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default Switcher;
