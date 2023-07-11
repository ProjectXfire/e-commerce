'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import {
  deleteBillboard,
  deleteCategory,
  deleteProduct,
  deleteSize
} from '@/app/(dashboard)/services';
import {
  type IBillboard,
  type ISize,
  type ICategory,
  IColor,
  IProduct
} from '@/app/core/interfaces';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  Button,
  AlertModal
} from '@/app/shared/components/ui';
import { deleteColor } from '../services/Color';

interface Props {
  data: ICategory | IBillboard | ISize | IColor | IProduct;
  paramKey: 'categories' | 'billboards' | 'sizes' | 'colors' | 'products';
}

function CellAction({ data, paramKey }: Props): JSX.Element {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (): void => {
    navigator.clipboard.writeText(data.id);
    toast.success('ID was successfully copied');
  };

  const onUpdate = (): void => {
    router.push(`/${params.id}/${paramKey}/${data.id}`);
  };

  const onDelete = async () => {
    setLoading(true);
    let _errorMessage = null;
    let _message = null;
    if (paramKey === 'billboards') {
      const billboard = data as IBillboard;
      const res = await deleteBillboard(
        params.id,
        billboard.id,
        billboard.imageUrl,
        billboard.imageCode
      );
      _errorMessage = res.errorMessage;
      _message = res.message;
    }
    if (paramKey === 'categories') {
      const res = await deleteCategory(params.id, data.id);
      _errorMessage = res.errorMessage;
      _message = res.message;
    }
    if (paramKey === 'sizes') {
      const res = await deleteSize(params.id, data.id);
      _errorMessage = res.errorMessage;
      _message = res.message;
    }
    if (paramKey === 'colors') {
      const res = await deleteColor(params.id, data.id);
      _errorMessage = res.errorMessage;
      _message = res.message;
    }
    if (paramKey === 'products') {
      const product = data as IProduct;
      const images = product.images?.map((img) => ({ secure_url: img.url, public_id: img.code }));
      const res = await deleteProduct(params.id, product.id, images);
      _errorMessage = res.errorMessage;
      _message = res.message;
    }
    if (_errorMessage) {
      toast.error(_errorMessage);
    } else {
      toast.success(_message);
    }
    router.refresh();
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
