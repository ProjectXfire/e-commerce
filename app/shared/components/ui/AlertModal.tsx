'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function AlertModal({ isOpen, loading, onClose, onConfirm }: Props): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <Modal
      isOpen={isOpen}
      title='Are you sure?'
      description='This action cannot be undone'
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button type='button' variant='outline' disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button type='button' variant='destructive' disabled={loading} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
export default AlertModal;
