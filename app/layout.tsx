import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prompt Exchange — Decentralized Dataset Marketplace on Shelby',
  description: 'Buy, sell, and discover AI prompt datasets stored on Shelby Protocol decentralized storage.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
