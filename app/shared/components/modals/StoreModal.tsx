'use client';

import { useModal } from '../../hooks';
import { Modal } from '../ui';

function StoreModal(): JSX.Element {
  const { isOpen, onClose } = useModal();

  return (
    <Modal
      isOpen={isOpen}
      title='Create store'
      description='Add a new store to manage products and categories'
      onClose={onClose}
    >
      <h1>Future create store form</h1>
    </Modal>
  );
}
export default StoreModal;
