import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nebulabs WebOS',
  description: 'A virtual desktop environment in the web.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%239333ea%22/><text y=%2275%22 x=%2250%22 text-anchor=%22middle%22 font-size=%2270%22 font-family=%22Inter,sans-serif%22 font-weight=%22900%22 fill=%22white%22>N</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
