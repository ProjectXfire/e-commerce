'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { ImagePlus, Trash } from 'lucide-react';
import { Button } from './Button';

interface IImgInfo {
  imageUrl: string;
  imageCode: string;
}

interface Props {
  disabled?: boolean;
  onChange: (value: string, imgId: string) => void;
  onRemove: (value: string, imgId: string) => void;
  values: IImgInfo[];
}

function ImageUpload({ values, disabled, onChange, onRemove }: Props): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);

  const onUpload = (result: any): void => {
    const { secure_url, public_id } = result.info;
    onChange(secure_url, public_id);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <>
      <div className='mb-4 flex items-center gap-4'>
        {values.map((v) => (
          <div key={v.imageUrl} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button
                type='button'
                variant='destructive'
                size='icon'
                onClick={() => onRemove(v.imageUrl, v.imageCode)}
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <NextImage className='object-cover' src={v.imageUrl} alt='Image' fill />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset='ecommerce'>
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button type='button' variant='secondary' disabled={disabled} onClick={onClick}>
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
}
export default ImageUpload;
