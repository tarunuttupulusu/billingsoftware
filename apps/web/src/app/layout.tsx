import './globals.css';
import { AppProvider } from '@/lib/state';
import { DynamicNavigation } from '@/components/layout/DynamicNavigation';

export const metadata = {
  title: 'Restaurant SaaS & POS Platform',
  description: 'Clean, professional multi-tenant restaurant management and billing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-main antialiased">
        <AppProvider>
          <DynamicNavigation>{children}</DynamicNavigation>
        </AppProvider>
      </body>
    </html>
  );
}
