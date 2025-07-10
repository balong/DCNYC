import type { Metadata } from 'next';
import { Inter, Bodoni_Moda } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
});

export const metadata: Metadata = {
  title: 'DCNYC',
  description: 'New York Diet Coke Reviews',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bodoni.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
