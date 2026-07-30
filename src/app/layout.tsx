import type { Metadata } from 'next';
import './globals.css';
import { ERPProvider } from '@/context/ERPContext';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'ISKCON Retail ERP | Command Center',
  description: 'Next.js App Router enterprise ERP for temple retail operations, literature distribution, and Govinda\'s inventory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ERPProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ERPProvider>
      </body>
    </html>
  );
}
