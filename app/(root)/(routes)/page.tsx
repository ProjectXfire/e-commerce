'use client';

import { useEffect } from 'react';
import { useModal } from '../../shared/hooks';

export default function SetupPage(): JSX.Element {
  const { isOpen, onOpen } = useModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return <></>;
}
