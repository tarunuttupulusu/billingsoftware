import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS Super Admin Portal | Restaurant SaaS Platform',
  description: 'Platform-level governance, tenant provisioning, approvals, subscriptions, and system monitoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-main antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
