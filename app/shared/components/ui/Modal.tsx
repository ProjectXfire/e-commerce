'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '.';

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: JSX.Element | JSX.Element[];
}

function Modal({ title, description, isOpen, onClose, children }: Props): JSX.Element {
  const onChange = (open: boolean): void => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
export default Modal;
