'use client';

import { useEffect, useState } from 'react';
import { StoreModal } from '@/app/(root)/components';

function ModalProviders(): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <>
      <StoreModal />
    </>
  );
}
export default ModalProviders;
