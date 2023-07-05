'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function MainNavbar({ className, ...props }: React.HtmlHTMLAttributes<HTMLElement>): JSX.Element {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.id}`,
      label: 'Overview',
      active: pathname === `/${params.id}`
    },
    {
      href: `/${params.id}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.id}/billboards`
    },
    {
      href: `/${params.id}/settings`,
      label: 'Settings',
      active: pathname === `/${params.id}/settings`
    }
  ];

  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {routes.map((r) => (
        <NextLink
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            r.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
          key={r.label}
          href={r.href}
        >
          {r.label}
        </NextLink>
      ))}
    </div>
  );
}
export default MainNavbar;
