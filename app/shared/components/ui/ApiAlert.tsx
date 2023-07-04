'use client';

import { Copy, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription, AlertTitle } from './Alert';
import { Badge, BadgeProps } from './Badge';
import { Button } from './Button';

interface Props {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

const textMap: Record<Props['variant'], string> = {
  public: 'Public',
  admin: 'Admin'
};

const variantMap: Record<Props['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
};

function ApiAlert({ title, description, variant = 'public' }: Props): JSX.Element {
  const onCopy = (): void => {
    navigator.clipboard.writeText(description);
    toast.success('Link copied');
  };

  return (
    <Alert className='overflow-auto'>
      <Server className='h-5 w-5' />
      <AlertTitle className='flex items-center gap-x-2 mb-0'>
        {title} <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className='mt-4 gap-2 flex items-center justify-between'>
        <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
          {description}
        </code>
        <Button type='button' variant='outline' onClick={onCopy}>
          <Copy className='h-4 w-4' />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
export default ApiAlert;
