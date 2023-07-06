'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { deleteBillboard, removeImage } from '@/app/(dashboard)/services';
import { type IBillboard } from '@/app/core/interfaces';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  Button,
  AlertModal
} from '@/app/shared/components/ui';

interface Props {
  data: IBillboard;
}

function CellAction({ data }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (): void => {
    navigator.clipboard.writeText(data.id);
    toast.success('ID was successfully copied');
  };

  const onUpdate = (): void => {
    router.push(`/${params.id}/billboards/${data.id}`);
  };

  const onDelete = async () => {
    setLoading(true);
    await removeImage(data.imageUrl, data.imageCode);
    const { errorMessage, message } = await deleteBillboard(params.id, data.id);
    if (errorMessage) {
      toast.error(errorMessage);
    } else {
      toast.success(message);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='h-8 w-8 p-0' type='button' variant='ghost'>
            <span className='sr-only'>Open Menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className='h-4 w-4 mr-2' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className='h-4 w-4 mr-2' />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4 mr-2' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
      />
    </>
  );
}
export default CellAction;
