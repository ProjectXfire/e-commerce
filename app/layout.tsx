import './globals.css';
import { Nunito } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={nunito.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
