'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CustomDropdownMenu } from '@/app/shared/components/ui';
import { MenuIcon } from 'lucide-react';

function MainNavbar({ className, ...props }: React.HtmlHTMLAttributes<HTMLElement>): JSX.Element {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const routes = [
    {
      value: `/${params.id}`,
      label: 'Overview',
      active: pathname === `/${params.id}`
    },
    {
      value: `/${params.id}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.id}/billboards`
    },
    {
      value: `/${params.id}/categories`,
      label: 'Categories',
      active: pathname === `/${params.id}/categories`
    },
    {
      value: `/${params.id}/sizes`,
      label: 'Sizes',
      active: pathname === `/${params.id}/sizes`
    },
    {
      value: `/${params.id}/colors`,
      label: 'Colors',
      active: pathname === `/${params.id}/colors`
    },
    {
      value: `/${params.id}/settings`,
      label: 'Settings',
      active: pathname === `/${params.id}/settings`
    }
  ];

  return (
    <>
      <div className={cn('block justify-end space-x-4 md:hidden', className)}>
        <CustomDropdownMenu
          menuTitle='Options'
          title={<MenuIcon className='h-4 w-4' />}
          items={routes}
          onClickItem={(value) => {
            router.push(value);
          }}
        />
      </div>
      <div className={cn('hidden items-center space-x-4 lg:space-x-6 md:flex', className)}>
        {routes.map((r) => (
          <NextLink
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              r.active ? 'text-black dark:text-white' : 'text-muted-foreground'
            )}
            key={r.label}
            href={r.value}
          >
            {r.label}
          </NextLink>
        ))}
      </div>
    </>
  );
}
export default MainNavbar;
