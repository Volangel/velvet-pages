import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velvet Pages | Erotica Ebook Creator',
  description: 'Create, write, and publish steamy romance novels for Amazon KDP',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-mesh min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

