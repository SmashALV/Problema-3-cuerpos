import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// No explicit ThemeProvider needed if just toggling a class on <html>
// However, if context were needed for theme, it would be imported here.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Celestial Orbits',
  description: 'Simulating the three-body problem with AI-generated initial conditions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Theme logic is handled in ThemeToggle and directly manipulates documentElement class */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
