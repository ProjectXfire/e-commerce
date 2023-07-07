'use client';

import * as React from 'react';

import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './DropdownMenu';

interface IItems {
  value: string;
  label: string;
}

interface Props {
  title: string | JSX.Element;
  menuTitle: string;
  onClickItem: (value: string) => void;
  items: IItems[];
}

function CustomDropdownMenu({ title, menuTitle, items, onClickItem }: Props) {
  const [position, setPosition] = React.useState('bottom');

  const onClick = (value: string): void => {
    onClickItem(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-9' variant='outline'>
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='text-xs'>{menuTitle}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {items.map((i) => (
            <DropdownMenuRadioItem key={i.label} value={i.value} onClick={() => onClick(i.value)}>
              {i.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomDropdownMenu;
