// FILE PATH: app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'TECHNOVA STUDIO // Elite Technical Architecture & Flagship Digital Products',
  description:
    'Technova Studio is a premier engineering collective specializing in real-time WebGL, distributed cloud architectures, high-performance web applications, and bespoke AI telemetry interfaces.',
  keywords: [
    'Technova Studio',
    'WebGL Developers',
    'Fullstack Engineering',
    'Creative Technologists',
    '3D Web Design',
    'Next.js Studio',
    'AI Systems',
  ],
  authors: [{ name: 'Technova Studio Collective' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://technovastudio.com'),
  openGraph: {
    title: 'TECHNOVA STUDIO // Beyond Digital Engineering',
    description: 'Elite Technical Architecture, WebGL Systems & High-End Digital Engineering.',
    url: 'https://technovastudio.com',
    siteName: 'Technova Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TECHNOVA STUDIO // Beyond Digital Engineering',
    description: 'Elite Technical Architecture, WebGL Systems & High-End Digital Engineering.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#fcfcfd' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('technova_theme');
                  var theme = saved;
                  if (!theme) {
                    var isLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                    theme = isLight ? 'minimal-clean' : 'dark-tech';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
