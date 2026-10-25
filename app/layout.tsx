// FILE PATH: app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/ui/CustomCursor';

export const metadata: Metadata = {
  title: 'TECHNOVA STUDIO // Beyond Digital Engineering',
  description: 'Elite Technical Architecture, WebGL Systems & High-End Digital Engineering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030303] text-zinc-100 antialiased selection:bg-red-600 selection:text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}